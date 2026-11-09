import { FormEvent, useState } from "react";
import { KeyRound, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDemoApiKey, setDemoApiKey } from "@/lib/demoKey";

function DemoAccessPage() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState(getDemoApiKey() ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (apiKey.trim().length < 20) {
      setError("Ingresa una API key válida de Gemini para activar la demo.");
      return;
    }
    setDemoApiKey(apiKey);
    navigate("/login");
  };

  return <div className="min-h-screen bg-[#f7f8fc] px-6 py-12 text-[#172033]"><div className="mx-auto max-w-2xl"><Link to="/landing" className="text-sm font-semibold text-[#5b4bdb]">← Volver a presentación</Link><div className="mt-10 rounded-3xl border border-[#e3e6f0] bg-white p-7 shadow-xl sm:p-10"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eeeaff] text-[#5b4bdb]"><KeyRound size={26} /></div><h1 className="mt-6 text-3xl font-bold">Activa la demo con tu API key</h1><p className="mt-3 leading-7 text-[#667085]">Para proteger los recursos del proyecto, cada visitante debe proporcionar su propia API key de Google Gemini. La clave solo se guarda en la sesión temporal del navegador y se envía al backend para sus escaneos.</p><div className="mt-6 rounded-xl border border-[#cfe8d9] bg-[#f0fbf4] p-4 text-sm text-[#287a4d]"><ShieldCheck className="mb-2" size={20} /><strong>No usamos la API key del propietario.</strong><br />No la compartas ni la guardes en repositorios públicos.</div><form onSubmit={handleSubmit} className="mt-7 space-y-4"><label htmlFor="demo-api-key" className="block text-sm font-semibold">Google Gemini API key</label><input id="demo-api-key" type="password" value={apiKey} onChange={(event) => { setApiKey(event.target.value); setError(""); }} placeholder="AIza..." autoComplete="off" className="w-full rounded-xl border border-[#dfe3ed] px-4 py-3 outline-none focus:border-[#5b4bdb] focus:ring-2 focus:ring-[#5b4bdb]/20" />{error && <p className="text-sm text-red-600">{error}</p>}<button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5b4bdb] px-5 py-3.5 font-semibold text-white hover:bg-[#4939c7]">Continuar a la demo <ArrowRight size={18} /></button></form><p className="mt-5 text-xs text-[#98a2b3]">La aplicación permite probar los accesos de asesor y administrador después de activar esta pantalla.</p></div></div></div>;
}

export { DemoAccessPage };
