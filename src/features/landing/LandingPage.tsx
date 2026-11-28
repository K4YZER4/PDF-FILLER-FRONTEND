import {
  ArrowRight,
  CheckCircle2,
  Container,
  ExternalLink,
  FileCheck2,
  FileScan,
  Play,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CustomVideoPlayer } from "./CustomVideoPlayer";

const pipelineLogs = [
  {
    step: "01",
    cmd: "POST /api/escaneos/unificado",
    status: "200 OK",
    detail: "INE + 2 Nóminas + Edo. Cuenta → Gemini AI + Zod",
  },
  {
    step: "02",
    cmd: "CALC /tabla-amortizacion",
    status: "VALIDADO",
    detail: "ExcelJS · pago quincenal, CAT y plazo (24–120q)",
  },
  {
    step: "03",
    cmd: "SIGN /firmar/:token",
    status: "OTP + PDF",
    detail: "Estampado multipágina (pdf-lib) + Cloudinary",
  },
  {
    step: "04",
    cmd: "AUDIT /mesa-control",
    status: "ACTIVO",
    detail: "RBAC · POR_FIRMAR → POR_APROBAR → ACTIVO",
  },
];

const architectureHighlights = [
  {
    tag: "AI / OCR",
    title: "Escaneo Multimodal Unificado",
    description:
      "Procesa INE, recibos de nómina y estado de cuenta en una sola llamada con Google Gemini SDK (@google/genai), validación Zod y verificación de CURP.",
    Icon: FileScan,
  },
  {
    tag: "SECURITY",
    title: "Firma Remota & Proxy Anti-SSRF",
    description:
      "Tokens de firma de un solo uso con expiración, verificación OTP de 6 dígitos, JWT + RBAC (Asesor/Admin), Rate Limiting y visor PDF con allowlist anti-SSRF.",
    Icon: ShieldCheck,
  },
  {
    tag: "ENGINE",
    title: "PDF Multipágina & Auditoría SQL",
    description:
      "Llenado AcroForm y estampado de firma manuscrita con pdf-lib, respaldado por PostgreSQL, Prisma 7 e historial de estados para Mesa de Control.",
    Icon: FileCheck2,
  },
  {
    tag: "DEVOPS",
    title: "Docker Multi-Stage & CI/CD",
    description:
      "Imagen Alpine de 3 etapas con npm prune --omit=dev y usuario no-root, más pipelines de GitHub Actions que validan tests, build y contenedor en cada PR.",
    Icon: Container,
  },
];

const techStack = [
  "NestJS 11",
  "React 19",
  "TypeScript",
  "Prisma 7 + PostgreSQL",
  "Gemini AI",
  "Docker Multi-Stage",
];

function LandingPage() {
  const supademoUrl = import.meta.env.VITE_SUPADEMO_URL as string | undefined;

  return (
    <div
      className="min-h-screen bg-[#f8fafc] text-[#0f172a]"
      style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}
    >
      <main>
        {/* Hero sin barra superior: foco directo en PDF FILLER y consola de flujo */}
        <section className="relative overflow-hidden border-b border-[#e2e8f0] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:py-24">
            <div>
              {/* Identificador grande de marca con fuente de oficina / consola */}
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#4f46e5]/20 bg-[#0f172a] text-white shadow-md">
                  <FileScan size={24} />
                </span>
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4f46e5]"
                    style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                  >
                    SISTEMA FINTECH · DOCUMENT AUTOMATION
                  </p>
                  <h1
                    className="text-4xl font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl"
                    style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                  >
                    PDF FILLER
                  </h1>
                </div>
              </div>

              <h2 className="mt-7 max-w-2xl text-2xl font-bold leading-snug tracking-tight text-[#1e293b] sm:text-3xl">
                Del expediente físico al contrato firmado y auditado, en un solo flujo.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-[#475569]">
                Plataforma full-stack para automatizar contratos de crédito vía nómina:
                extrae datos con IA, calcula amortizaciones, genera el PDF listo para firma
                remota con OTP y controla la aprobación en Mesa de Control.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/demo"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f172a] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/15 transition hover:bg-[#1e293b]"
                  style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                >
                  Probar la aplicación <ArrowRight size={17} />
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-5 py-3.5 text-sm font-semibold text-[#0f172a] shadow-sm transition hover:border-[#94a3b8] hover:bg-[#f1f5f9]"
                  style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                >
                  <Play size={16} className="fill-current text-[#4f46e5]" /> Ver demo en video
                </a>
              </div>

              {/* Stack técnico en formato consola */}
              <div
                className="mt-8 flex flex-wrap gap-2"
                style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
              >
                {techStack.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#cbd5e1] bg-white/90 px-2.5 py-1 text-xs font-medium text-[#334155]"
                  >
                    <CheckCircle2 size={13} className="text-[#10b981]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Tarjeta derecha estilo consola / pipeline de ingeniería */}
            <div className="rounded-2xl border border-[#cbd5e1] bg-[#0f172a] p-1.5 shadow-2xl shadow-[#0f172a]/15">
              <div
                className="rounded-xl border border-white/10 bg-[#0b1120] p-5 text-[#e2e8f0]"
                style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
              >
                {/* Barra superior tipo terminal */}
                <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3.5 text-xs">
                  <div className="flex items-center gap-2 text-[#94a3b8]">
                    <Terminal size={14} className="text-[#818cf8]" />
                    <span>pdf-filler-api · pipeline.log</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded bg-[#10b981]/15 px-2 py-0.5 text-[11px] font-semibold text-[#34d399]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                    LIVE DEMO
                  </span>
                </div>

                {/* Pasos del pipeline */}
                <div className="space-y-3">
                  {pipelineLogs.map(({ step, cmd, status, detail }) => (
                    <div
                      key={step}
                      className="rounded-lg border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-[#818cf8]/40 hover:bg-white/[0.05]"
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="rounded bg-[#4f46e5]/25 px-1.5 py-0.5 font-bold text-[#a5b4fc]">
                            {step}
                          </span>
                          <span className="truncate font-semibold text-white">{cmd}</span>
                        </div>
                        <span className="shrink-0 text-[11px] font-semibold text-[#34d399]">
                          [{status}]
                        </span>
                      </div>
                      <p className="mt-1.5 pl-8 text-[11px] leading-relaxed text-[#94a3b8]">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Pie de consola */}
                <div className="mt-5 flex items-center justify-between rounded-lg border border-[#10b981]/25 bg-[#10b981]/10 px-4 py-3 text-xs">
                  <span className="text-[#cbd5e1]">FOLIO: C-000003 · 18 PÁGINAS</span>
                  <span className="font-bold text-[#34d399]">ESTADO: ACTIVO</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Video Demo */}
        <section id="demo" className="border-b border-[#e2e8f0] bg-white py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p
                  className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f46e5]"
                  style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                >
                  // RECORRIDO GUIADO EN VIDEO
                </p>
                <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
                  Mira el flujo completo antes de entrar.
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#475569] sm:text-base">
                  Escaneo con IA, generación del contrato PDF de 18 páginas, firma manuscrita
                  con OTP y revisión con rechazo/aprobación en Mesa de Control.
                </p>
              </div>
              <span
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#475569]"
                style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
              >
                1080P · 01:52 MIN
              </span>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-[#cbd5e1] bg-[#0f172a] shadow-xl">
              <div
                className="flex items-center justify-between border-b border-white/10 bg-[#0f172a] px-4 py-2.5 text-xs text-[#94a3b8]"
                style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]/80" />
                  <span className="ml-2 text-[#cbd5e1]">demo-recorrido-completo.mp4</span>
                </div>
                <span className="hidden sm:inline">DATOS SENSIBLES DIFUMINADOS</span>
              </div>
              {supademoUrl ? (
                <iframe
                  src={supademoUrl}
                  title="Demo interactiva de PDF FILLER"
                  className="h-[520px] w-full"
                  allowFullScreen
                />
              ) : (
                <CustomVideoPlayer src="/demo-video.mp4" poster="/demo-thumbnail.jpg" />
              )}
            </div>
          </div>
        </section>

        {/* Sección de Ingeniería y Arquitectura para Portafolio */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#4f46e5]"
              style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
            >
              // ARQUITECTURA & DECISIONES TÉCNICAS
            </p>
            <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-[#0f172a]">
              Diseñado para producción, no solo como prototipo.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {architectureHighlights.map(({ tag, title, description, Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition hover:border-[#cbd5e1] hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-[#0f172a]">
                    <Icon size={20} />
                  </span>
                  <span
                    className="rounded bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold tracking-wider text-[#475569]"
                    style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                  >
                    {tag}
                  </span>
                </div>
                <h3
                  className="mt-5 text-base font-bold text-[#0f172a]"
                  style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#475569]">{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e2e8f0] bg-white">
        <div
          className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs text-[#475569] sm:flex-row sm:items-center sm:justify-between"
          style={{ fontFamily: "'IBM Plex Mono', Consolas, monospace" }}
        >
          <span>PDF FILLER · Automatización documental & firma remota</span>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/K4YZER4/portafolio-backend/tree/main"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#334155] hover:text-[#4f46e5]"
            >
              Backend Repo <ExternalLink size={12} />
            </a>
            <a
              href="https://github.com/K4YZER4/PDF-FILLER-FRONTEND"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-[#334155] hover:text-[#4f46e5]"
            >
              Frontend Repo <ExternalLink size={12} />
            </a>
            <Link to="/demo" className="font-semibold text-[#4f46e5] hover:underline">
              Entrar a la demo →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export { LandingPage };
