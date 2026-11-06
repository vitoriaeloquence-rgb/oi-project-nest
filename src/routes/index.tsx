import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import logo from "@/assets/black-week-logo.webp.asset.json";
import { enviarPreCadastro } from "@/lib/precadastro.functions";
import {
  PAGAMENTOS, TODAS_TURMAS, TURMAS_FDS, TURMAS_NOITE, type Turma,
  formatPhone, isValidName, isValidPhone,
} from "@/lib/turmas";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: logo.url, fetchpriority: "high" }],
    meta: [
      { title: "Pré-cadastro Black Week Eloquence" },
      { name: "description", content: "Faça seu pré-cadastro para a Black Week da Eloquence Escola de Oratória e escolha sua turma." },
      { property: "og:title", content: "Pré-cadastro Black Week Eloquence" },
      { property: "og:description", content: "Escolha sua turma e adiante seu atendimento. Inscrições abrem dia 9 de novembro, às 19h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const AVISO = "O pré-cadastro não reserva sua vaga. A matrícula será confirmada após a conclusão da compra, conforme a disponibilidade da turma.";

type Errors = Partial<Record<"nome" | "whatsapp" | "turma" | "pagamento" | "geral", string>>;

function Index() {
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [turma, setTurma] = useState<string>("");
  const [pagamento, setPagamento] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const busy = useRef(false);
  const enviar = useServerFn(enviarPreCadastro);
  const sel = TODAS_TURMAS.find((t) => t.codigo === turma);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const errs: Errors = {};
    if (!isValidName(nome)) errs.nome = "Informe seu nome completo (nome e sobrenome).";
    if (!isValidPhone(whatsapp)) errs.whatsapp = "Informe um WhatsApp válido com DDD. Ex.: (71) 99999-9999";
    if (!sel) errs.turma = "Escolha uma turma.";
    if (!pagamento) errs.pagamento = "Escolha a forma de pagamento.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    busy.current = true;
    setSending(true);
    try {
      await enviar({ data: { nome, whatsapp, turma, pagamento: pagamento as (typeof PAGAMENTOS)[number] } });
      navigate({ to: "/obrigado" });
    } catch {
      setErrors({ geral: "Não conseguimos enviar agora. Verifique sua conexão e tente novamente." });
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  return (
    <main className="bw-page min-h-screen px-4 pb-16">
      <div className="mx-auto max-w-3xl">
        <img src={logo.url} alt="Black Week Eloquence Escola de Oratória — 9 a 13 de novembro" width={262} height={163} fetchPriority="high" decoding="async" className="mx-auto mt-6 w-48 sm:w-60" />

            <header className="mt-2 text-center">
              <h1 className="text-2xl font-extrabold sm:text-3xl">Pré-cadastro Black Week Eloquence</h1>
              <p className="mt-3 text-muted-foreground">Preencha seus dados, escolha sua turma e informe como pretende pagar para adiantar seu atendimento. As inscrições abrem segunda-feira, dia 9 de novembro, às 19h.</p>
              <p className="bw-notice mt-4 text-sm">{AVISO}</p>
            </header>

            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-8">
              <div className="bw-card space-y-5 p-5 sm:p-6">
                <Field id="nome" label="Nome completo" error={errors.nome}>
                  <input id="nome" className="bw-input" autoComplete="name" placeholder="Digite seu nome completo" value={nome} maxLength={120}
                    onChange={(e) => setNome(e.target.value)} aria-invalid={!!errors.nome} aria-describedby="nome-err" />
                </Field>
                <Field id="whatsapp" label="WhatsApp com DDD" error={errors.whatsapp}>
                  <input id="whatsapp" className="bw-input" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(71) 99999-9999"
                    value={whatsapp} onChange={(e) => setWhatsapp(formatPhone(e.target.value))} aria-invalid={!!errors.whatsapp} aria-describedby="whatsapp-err" />
                </Field>
              </div>

              <fieldset>
                <legend className="text-xl font-bold">Qual turma combina com sua rotina?</legend>
                {errors.turma && <p data-error className="bw-error mt-2">{errors.turma}</p>}
                <Grupo titulo="Durante a semana à noite" sub="Quatro noites presenciais" turmas={TURMAS_NOITE} value={turma} onChange={setTurma} />
                <Grupo titulo="Final de semana" sub="Três dias presenciais" turmas={TURMAS_FDS} value={turma} onChange={setTurma} />
                <p className="mt-5 text-sm text-muted-foreground"><strong className="text-foreground">Aulas presenciais em Salvador</strong><br />Empresarial Mundo Plaza, 9º andar, sala 917.</p>
              </fieldset>

              <fieldset className="bw-card p-5 sm:p-6">
                <legend className="sr-only">Forma de pagamento</legend>
                <p className="text-xl font-bold" aria-hidden>Como você pretende pagar?</p>
                <p className="mt-1 text-sm text-muted-foreground">Nesta etapa, você informa apenas sua preferência. Nenhum pagamento será realizado.</p>
                {errors.pagamento && <p data-error className="bw-error mt-2">{errors.pagamento}</p>}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {PAGAMENTOS.map((p) => (
                    <label key={p} className="bw-option" data-selected={pagamento === p}>
                      <input type="radio" name="pagamento" value={p} checked={pagamento === p} onChange={() => setPagamento(p)} className="bw-radio" />
                      <span className="font-semibold">{p}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <section className="bw-card p-5 sm:p-6" aria-live="polite">
                <h2 className="text-xl font-bold">Confira sua escolha</h2>
                <dl className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Turma</dt><dd>{sel ? `${sel.codigo} — ${sel.periodo === "Noite" ? "Turma da noite" : "Final de semana"}` : "—"}</dd>
                  <dt className="text-muted-foreground">Datas</dt><dd>{sel?.datas ?? "—"}</dd>
                  <dt className="text-muted-foreground">Horários</dt><dd>{sel ? sel.horarios.join(" · ") : "—"}</dd>
                  <dt className="text-muted-foreground">Pagamento</dt><dd>{pagamento || "—"}</dd>
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">Você pode alterar qualquer escolha acima antes de enviar.</p>
              </section>

              <div>
                {errors.geral && <p data-error className="bw-error mb-3 text-center" role="alert">{errors.geral}</p>}
                <button type="submit" disabled={sending} className="bw-button">{sending ? "Enviando…" : "Enviar meu pré-cadastro"}</button>
                <p className="mt-3 text-center text-sm text-muted-foreground">{AVISO}</p>
              </div>
            </form>
      </div>
    </main>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-semibold">{label}</label>
      {children}
      {error && <p id={`${id}-err`} data-error className="bw-error mt-2">{error}</p>}
    </div>
  );
}

function Grupo({ titulo, sub, turmas, value, onChange }: { titulo: string; sub: string; turmas: Turma[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-primary">{titulo}</h3>
      <p className="text-sm text-muted-foreground">{sub}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {turmas.map((t) => {
          const on = value === t.codigo;
          return (
            <label key={t.codigo} className="bw-option items-start" data-selected={on}>
              <input type="radio" name="turma" value={t.codigo} checked={on} onChange={() => onChange(t.codigo)} className="bw-radio mt-1" />
              <span className="min-w-0">
                <span className="block font-bold">{t.codigo} — {t.periodo === "Noite" ? "Turma da noite" : "Final de semana"}</span>
                <span className="block">{t.datas}</span>
                {t.horarios.map((h) => <span key={h} className="block text-sm text-muted-foreground">{h}</span>)}
                {on && <span className="bw-badge mt-2">Turma selecionada</span>}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
