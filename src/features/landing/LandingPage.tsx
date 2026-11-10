import { ArrowRight, CheckCircle2, FileScan, LockKeyhole, Play, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  ["01", "Carga documentos", "INE, nóminas y estado de cuenta."],
  ["02", "Extrae y valida", "OCR con Gemini y revisión manual."],
  ["03", "Calcula el crédito", "Tabla de amortización y condiciones."],
  ["04", "Genera y firma", "PDF, enlace de firma y aprobación."],
];

function LandingPage() {
  const supademoUrl = import.meta.env.VITE_SUPADEMO_URL as string | undefined;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-[#172033]">
      <header className="sticky top-0 z-20 border-b border-[#e4e7ef]/80 bg-[#f7f8fc]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-3 font-bold tracking-tight">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b4bdb] text-white shadow-lg shadow-[#5b4bdb]/20"><FileScan size={20} /></span>
            <span>PDF FILLER</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#demo" className="hidden text-sm font-medium text-[#667085] hover:text-[#172033] sm:block">Cómo funciona</a>
            <Link to="/demo" className="rounded-lg bg-[#5b4bdb] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#5b4bdb]/20 hover:bg-[#4939c7]">Probar demo</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dcd8ff] bg-white px-3 py-1.5 text-xs font-semibold text-[#5b4bdb]"><Sparkles size={14} /> Automatización documental para crédito</div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl">Del documento al contrato firmado, en un solo flujo.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">PDF FILLER convierte documentos de crédito en datos estructurados, calcula las condiciones, genera el contrato y coordina la firma digital y la aprobación.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/demo" className="inline-flex items-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3.5 font-semibold text-white shadow-xl shadow-[#5b4bdb]/20 hover:bg-[#4939c7]">Probar la aplicación <ArrowRight size={18} /></Link>
              <a href="#demo" className="inline-flex items-center gap-2 rounded-xl border border-[#dfe3ed] bg-white px-5 py-3.5 font-semibold text-[#344054] hover:bg-[#f1f2f7]"><Play size={17} /> Ver el flujo</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-[#667085]">
              {['NestJS + React', 'OCR con Gemini', 'Firma digital', 'Mesa de Control'].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#36a269]" />{item}</span>)}
            </div>
          </div>
          <div className="rounded-3xl border border-[#e3e6f0] bg-white p-3 shadow-2xl shadow-[#25325b]/10">
            <div className="rounded-2xl bg-[#121a2d] p-6 text-white">
              <div className="mb-12 flex items-center justify-between text-xs text-white/60"><span>PDF FILLER / WORKFLOW</span><span className="rounded-full bg-[#36a269]/20 px-2 py-1 text-[#7de0a8]">LIVE DEMO</span></div>
              <div className="space-y-4">
                {steps.map(([number, title, description], index) => <div key={number} className="flex items-center gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5b4bdb] font-bold">{number}</span><div className="flex-1"><p className="font-semibold">{title}</p><p className="text-xs text-white/55">{description}</p></div>{index < 3 && <div className="hidden h-px w-8 bg-white/15 sm:block" />}</div>)}
              </div>
              <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Contrato generado <span className="float-right font-semibold text-[#7de0a8]">POR APROBAR</span></div>
            </div>
          </div>
        </section>

        <section id="demo" className="border-y border-[#e5e7ef] bg-white py-20">
          <div className="mx-auto max-w-6xl px-6"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-widest text-[#5b4bdb]">Experiencia guiada</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Mira cómo funciona antes de entrar.</h2><p className="mt-4 text-[#667085]">La demo explica el recorrido completo: captura, validación, generación, firma y revisión por Mesa de Control.</p></div><div className="mt-8 overflow-hidden rounded-3xl border border-[#e3e6f0] bg-[#f7f8fc] shadow-xl">{supademoUrl ? <iframe src={supademoUrl} title="Demo interactiva de PDF FILLER" className="h-[520px] w-full" allowFullScreen /> : <div className="flex h-[360px] flex-col items-center justify-center gap-4 p-8 text-center"><Play size={36} className="text-[#5b4bdb]" /><p className="font-semibold">Aquí aparecerá el recorrido interactivo de Supademo.</p><p className="max-w-md text-sm text-[#667085]">Configura <code>VITE_SUPADEMO_URL</code> cuando tengas listo el video.</p></div>}</div></div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
          {[['Captura inteligente', 'Reduce la captura manual y transforma documentos en información utilizable.', FileScan], ['Seguridad por diseño', 'Sesiones protegidas, roles separados y firma mediante enlace temporal.', ShieldCheck], ['Lista para crecer', 'Arquitectura NestJS, React, PostgreSQL y almacenamiento de documentos.', LockKeyhole]].map(([title, description, Icon]) => <article key={String(title)} className="rounded-2xl border border-[#e3e6f0] bg-white p-6"><Icon className="text-[#5b4bdb]" size={24} /><h3 className="mt-5 font-bold">{String(title)}</h3><p className="mt-2 text-sm leading-6 text-[#667085]">{String(description)}</p></article>)}
        </section>
      </main>
      <footer className="border-t border-[#e5e7ef] bg-white"><div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-[#667085] sm:flex-row sm:items-center sm:justify-between"><span>PDF FILLER · Proyecto de automatización documental</span><Link to="/demo" className="font-semibold text-[#5b4bdb]">Entrar a la demo →</Link></div></footer>
    </div>
  );
}

export { LandingPage };
