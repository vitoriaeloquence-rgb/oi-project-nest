import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PAGAMENTOS, TODAS_TURMAS, formatPhone, isValidName, isValidPhone } from "./turmas";

const SHEET_ID = "1B0XJUknCXegKZrI9pw6WgNj0MhRVQgU2Su1HZ8Ly4sw";
const TAB = "Untitled";
const GATEWAY = "https://connector-gateway.lovable.dev/google_sheets/v4";

const schema = z.object({
  nome: z.string().trim().refine(isValidName, "Nome inválido"),
  whatsapp: z.string().trim().refine(isValidPhone, "WhatsApp inválido"),
  turma: z.string().refine((c) => TODAS_TURMAS.some((t) => t.codigo === c), "Turma inválida"),
  pagamento: z.enum(PAGAMENTOS),
});

export const enviarPreCadastro = createServerFn({ method: "POST" })
  .inputValidator((d) => schema.parse(d))
  .handler(async ({ data }) => {
    const lovableKey = process.env["LOVABLE_API_KEY"];
    const sheetsKey = process.env["GOOGLE_SHEETS_API_KEY"];
    if (!lovableKey || !sheetsKey) throw new Error("Integração com a planilha não configurada.");
    const headers = {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": sheetsKey,
      "Content-Type": "application/json",
    };
    const turma = TODAS_TURMAS.find((t) => t.codigo === data.turma)!;
    const nome = data.nome.replace(/\s+/g, " ");
    const whatsapp = formatPhone(data.whatsapp);

    // Evita duplicar o mesmo envio (cliques repetidos / novas tentativas)
    const existing = await fetch(`${GATEWAY}/spreadsheets/${SHEET_ID}/values/${TAB}!A:G`, { headers });
    if (!existing.ok) {
      console.error("Sheets read failed", existing.status, await existing.text());
      throw new Error("Não foi possível acessar a planilha.");
    }
    const rows: string[][] = (await existing.json()).values ?? [];
    const dup = rows.some(
      (r) => r[1] === nome && r[2] === whatsapp && r[3] === turma.codigo && r[6] === data.pagamento,
    );
    if (dup) return { ok: true, duplicate: true };

    const fmt = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
    });
    const p = Object.fromEntries(fmt.formatToParts(new Date()).map((x) => [x.type, x.value]));
    const dataHora = `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;

    const row = [dataHora, nome, whatsapp, turma.codigo, turma.periodo, turma.datasCurtas, data.pagamento];
    const res = await fetch(
      `${GATEWAY}/spreadsheets/${SHEET_ID}/values/${TAB}!A:G:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      { method: "POST", headers, body: JSON.stringify({ values: [row] }) },
    );
    if (!res.ok) {
      console.error("Sheets append failed", res.status, await res.text());
      throw new Error("Não foi possível salvar na planilha.");
    }
    return { ok: true, duplicate: false };
  });
