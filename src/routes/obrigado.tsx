import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/black-week-logo.webp.asset.json";

const WHATSAPP =
  "https://wa.me/5571981886135?text=Oi%2C%20eu%20preenchi%20o%20formul%C3%A1rio%2C%20mas%20tenho%20uma%20d%C3%BAvida%20";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Pré-inscrição recebido — Black Week Eloquence" },
      { name: "description", content: "Recebemos seu pré-inscrição para a Black Week da Eloquence Escola de Oratória." },
      { property: "og:title", content: "Pré-inscrição recebido — Black Week Eloquence" },
      { property: "og:description", content: "Seu pré-inscrição foi recebido. As inscrições abrem dia 9 de novembro, às 19h." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Obrigado,
});

function Obrigado() {
  return (
    <main className="bw-page min-h-screen px-4 pb-16">
      <div className="mx-auto max-w-xl">
        <img src={logo.url} alt="Black Week Eloquence Escola de Oratória" width={262} height={163} className="mx-auto mt-6 w-48 sm:w-60" />
        <section className="bw-card mt-6 p-6 text-center sm:p-10" role="status">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Pré-inscrição recebido! ✅</h1>
          <p className="mt-4 text-muted-foreground">Já recebemos seus dados e sua turma de interesse.</p>
          <p className="mt-3">
            As inscrições abrem <strong>segunda-feira, 9 de novembro, às 19h</strong>. Acompanhe o grupo VIP para receber o link e concluir sua compra.
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Importante:</strong> o pré-inscrição não reserva sua vaga. A matrícula depende da conclusão da compra e da disponibilidade da turma.
          </p>
          <hr className="my-6 border-border" />
          <p className="font-semibold">Ficou com alguma dúvida ou quer deixar uma observação?</p>
          <p className="mt-1 text-sm text-muted-foreground">Fale com a nossa equipe pelo WhatsApp.</p>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="bw-button mt-4 inline-flex items-center justify-center">
            Falar com a equipe no WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
