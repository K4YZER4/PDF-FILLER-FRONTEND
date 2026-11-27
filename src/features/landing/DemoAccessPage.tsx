import { FormEvent, useState } from "react";
import {
  FileScan,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Play,
  Lock,
  Server,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDemoApiKey, setDemoApiKey } from "@/lib/demoKey";

function DemoAccessPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(getDemoApiKey() ?? "");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const cleanKey = apiKey.trim();
    if (cleanKey.length < 20) {
      setError("Ingresa una API key válida de Google Gemini (generalmente comienza con AIza...)");
      return;
    }
    setDemoApiKey(cleanKey);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-8 text-[#172033] sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header con logo */}
        <div className="flex items-center justify-between">
          <Link
            to="/landing"
            className="inline-flex items-center gap-3 font-bold tracking-tight text-[#172033]"
            aria-label="Volver a PDF FILLER"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5b4bdb] text-white shadow-lg shadow-[#5b4bdb]/20">
              <FileScan size={20} />
            </span>
            <span className="text-lg">PDF FILLER</span>
          </Link>

          <Link
            to="/landing#demo"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b4bdb] hover:underline sm:text-sm"
          >
            <Play size={14} className="fill-current" />
            Ver video demo sin API key
          </Link>
        </div>

        {/* Card principal */}
        <div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-[#e3e6f0] bg-white p-6 shadow-xl sm:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#5b4bdb]">
              <KeyRound size={24} />
            </div>
            <div>
              <span className="inline-block rounded-full bg-[#f0ebff] px-2.5 py-0.5 text-xs font-bold text-[#5b4bdb]">
                Modo Demostración Interactiva
              </span>
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                Activa la demo con tu API key de Gemini
              </h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-[#667085]">
            Para que puedas probar el escaneo inteligente con IA de documentos reales (INE, nóminas y estados de cuenta), la plataforma permite conectar tu propia clave gratuita de Google Gemini.
          </p>

          {/* Bloque explicativo: Por qué no dejamos una puesta + Contenedor efímero */}
          <div className="mt-5 space-y-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs sm:text-sm leading-relaxed text-[#475569]">
            <div className="flex items-start gap-2.5">
              <Lock className="mt-0.5 shrink-0 text-[#5b4bdb]" size={16} />
              <p>
                <strong>¿Por qué no hay una API key pública preconfigurada?</strong> Por políticas estrictas de seguridad y para evitar abusos o agotamiento de cuotas entre visitantes.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#16a34a]" size={16} />
              <p>
                <strong>Se guarda únicamente en tu navegador:</strong> Tu clave se conserva sólo en la memoria local de sesión (<code>sessionStorage</code>). Jamás se almacena en ninguna base de datos ni es compartida.
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <Server className="mt-0.5 shrink-0 text-[#0284c7]" size={16} />
              <p>
                <strong>Entorno 100% efímero y seguro:</strong> El backend y la base de datos corren en un contenedor temporal aislado. Una vez que el contenedor se apaga o reinicia, todos los contratos y datos temporales generados se destruyen automáticamente.
              </p>
            </div>
          </div>

          {/* Enlace para obtener la API Key en Google AI Studio */}
          <div className="mt-5 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] p-4 text-xs sm:text-sm text-[#1e40af]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-[#1e3a8a]">¿No tienes una clave? Es 100% gratuita:</p>
                <p className="mt-0.5 text-xs text-[#3b82f6]">Obtén una clave gratis con tu cuenta de Google en Google AI Studio en menos de 1 minuto.</p>
              </div>
              <a
                href="https://aistudio.google.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#2563eb] px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-[#1d4ed8] transition"
              >
                <span>Obtener en AI Studio</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="demo-api-key" className="block text-xs sm:text-sm font-semibold text-[#172033]">
                  Ingresa tu Google Gemini API key
                </label>
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#5b4bdb] hover:underline inline-flex items-center gap-1"
                >
                  aistudio.google.com/api-keys
                  <ExternalLink size={11} />
                </a>
              </div>
              <div className="relative mt-1.5">
                <input
                  id="demo-api-key"
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(event) => {
                    setApiKey(event.target.value);
                    setError("");
                  }}
                  placeholder="AIzaSy..."
                  autoComplete="off"
                  className="w-full rounded-xl border border-[#dfe3ed] px-4 py-3 pr-11 text-sm outline-none transition focus:border-[#5b4bdb] focus:ring-2 focus:ring-[#5b4bdb]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? "Ocultar clave" : "Mostrar clave"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5b4bdb]/20 hover:bg-[#4939c7] transition active:scale-[0.99]"
            >
              Continuar a la demo <ArrowRight size={18} />
            </button>
          </form>

          {/* Alternativa: Ver video demo sin ingresar nada */}
          <div className="mt-6 border-t border-[#e2e8f0] pt-5 text-center">
            <p className="text-xs text-[#64748b]">
              ¿Prefieres no ingresar ninguna clave?
            </p>
            <Link
              to="/landing#demo"
              className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5b4bdb] hover:text-[#4338ca] hover:underline"
            >
              <Play size={13} className="fill-current" />
              Mira el recorrido guiado en video (1080p con escaneo, firma y mesa de control)
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-[#98a2b3]">
            En la siguiente pantalla podrás acceder con las credenciales demo preconfiguradas de <strong>Asesor</strong> o <strong>Administrador</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}

export { DemoAccessPage };
