// Configuração única das turmas — edite aqui para atualizar o formulário.
export type Turma = {
  codigo: string;
  periodo: "Noite" | "Final de semana";
  datas: string; // texto exibido no card
  datasCurtas: string; // texto gravado na planilha
  horarios: string[];
};

const HORARIOS_NOITE = ["Seg, ter e qui: 18h às 22h", "Qua: 18h às 23h"];
const HORARIOS_FDS = ["Sex: 18h às 22h", "Sáb: 8h30 às 19h", "Dom: 9h às 13h"];

const noite = (codigo: string, datas: string, datasCurtas: string): Turma => ({
  codigo, periodo: "Noite", datas, datasCurtas, horarios: HORARIOS_NOITE,
});
const fds = (codigo: string, datas: string, datasCurtas: string): Turma => ({
  codigo, periodo: "Final de semana", datas, datasCurtas, horarios: HORARIOS_FDS,
});

export const TURMAS_NOITE: Turma[] = [
  noite("N1", "16 a 19 de novembro de 2026", "16 a 19/11/2026"),
  noite("N2", "23 a 26 de novembro de 2026", "23 a 26/11/2026"),
  noite("N3", "7 a 10 de dezembro de 2026", "07 a 10/12/2026"),
  noite("N4", "14 a 17 de dezembro de 2026", "14 a 17/12/2026"),
  noite("N5", "11 a 14 de janeiro de 2027", "11 a 14/01/2027"),
  noite("N6", "25 a 28 de janeiro de 2027", "25 a 28/01/2027"),
];

export const TURMAS_FDS: Turma[] = [
  fds("F1", "27 a 29 de novembro de 2026", "27 a 29/11/2026"),
  fds("F2", "11 a 13 de dezembro de 2026", "11 a 13/12/2026"),
  fds("F3", "18 a 20 de dezembro de 2026", "18 a 20/12/2026"),
  fds("F4", "15 a 17 de janeiro de 2027", "15 a 17/01/2027"),
  fds("F5", "29 a 31 de janeiro de 2027", "29 a 31/01/2027"),
];

export const TODAS_TURMAS = [...TURMAS_NOITE, ...TURMAS_FDS];

export const PAGAMENTOS = ["À vista no Pix", "Parcelado no cartão"] as const;

export function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

export function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function isValidPhone(v: string) {
  const d = onlyDigits(v);
  if (d.length !== 10 && d.length !== 11) return false;
  if (Number(d.slice(0, 2)) < 11) return false;
  if (d.length === 11 && d[2] !== "9") return false;
  return true;
}

export function isValidName(v: string) {
  const t = v.trim().replace(/\s+/g, " ");
  return t.length >= 3 && t.length <= 120 && /^[\p{L}' .-]+$/u.test(t) && t.includes(" ");
}
