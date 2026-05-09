/** Pantalla de inicio de sesión con credenciales mock.
 *  Valida contra MOCK_USERS y redirige a / en caso de éxito.
 *  Muestra error si las credenciales son incorrectas.
 *  Layout: columna centrada en móvil, dos columnas en desktop. */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components";
import { useContractStore } from "@/store/useContractStore";
import type { UserRole } from "@/store/useContractStore";
import loginIllustration from "@/assets/LogIn-.png";
import logo from "@/assets/Logo.png";

const MOCK_USERS: { email: string; password: string; role: UserRole }[] = [
  { email: "asesor@credifom.mx", password: "1234", role: "asesor" },
  { email: "admin@credifom.mx", password: "1234", role: "admin" },
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const login = useContractStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      setError("Credenciales incorrectas.");
      return;
    }
    login(user.email, user.role);
    navigate("/");
  };

  return (
    /**
     * Contenedor raíz: ocupa toda la pantalla.
     * - Móvil:   fondo liso, centrado verticalmente, formulario a ancho completo.
     * - Desktop: dividido en dos mitades (izq: formulario | der: ilustración).
     */
    <div className="min-h-screen w-full flex">
      {/* ── Columna izquierda: formulario ─────────────────────────────── */}
      <div
        className="
        flex flex-col justify-center
        w-full md:w-1/3
        px-8 py-12 sm:px-14 lg:px-20
        bg-[#F4F4F6]
      "
      >
        {/* Logo */}
        <div className="mb-8">
          <img
            src={logo}
            alt="CREDIFOM"
            className="h-10 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* Encabezado */}
        <div className="mb-8">
          {/* Desktop muestra "Bienvenidos" + subtítulo; móvil solo "Iniciar sesión" */}
          <h1 className="text-2xl font-bold text-gray-900 hidden md:block">
            Bienvenidos
          </h1>
          <p className="text-sm text-gray-500 mt-1 hidden md:block">
            Inicia sesion para empezar a trabajar
          </p>
          <h1 className="text-2xl font-bold text-gray-900 md:hidden">
            Iniciar sesión
          </h1>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm w-full">
          {/* Usuario */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Usuario
            </label>
            <input
              id="email"
              type="email"
              placeholder="Usuario"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="
                w-full rounded-xl border border-gray-300 bg-white
                px-4 py-3 text-sm text-gray-900 placeholder-gray-400
                outline-none transition
                focus:border-purple-600 focus:ring-2 focus:ring-purple-100
              "
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="* * * * * * * *"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="
                  w-full rounded-xl border border-gray-300 bg-white
                  px-4 py-3 pr-11 text-sm text-gray-900 placeholder-gray-400
                  outline-none transition
                  focus:border-purple-600 focus:ring-2 focus:ring-purple-100
                "
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label={
                  showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* ¿Olvidaste tu contraseña? */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="text-sm text-purple-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* ¿Recordar sesión? — solo desktop */}
          <div className="hidden md:flex items-center justify-between">
            <span className="text-sm text-gray-600">¿Recordar sesion?</span>
            <button
              type="button"
              role="switch"
              aria-checked={remember}
              onClick={() => setRemember((v) => !v)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${remember ? "bg-purple-600" : "bg-gray-300"}
              `}
            >
              <span
                className={`
                inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform
                ${remember ? "translate-x-6" : "translate-x-1"}
              `}
              />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Botón submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full !rounded-xl !py-3.5 text-base font-semibold"
          >
            Iniciar sesión
          </Button>

          {/* Pie */}
          <p className="text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="text-purple-600 font-medium hover:underline"
            >
              Solicita una
            </button>
          </p>
        </form>

        {/* Credenciales de prueba */}
        <div className="mt-8 max-w-sm w-full text-[11px] text-gray-400 space-y-0.5">
          <p className="font-medium text-gray-500">Credenciales de prueba:</p>
          <p>Asesor: asesor@credifom.mx / 1234</p>
          <p>Admin: admin@credifom.mx / 1234</p>
        </div>
      </div>

      {/* ── Columna derecha: ilustración (solo desktop) ───────────────── */}
      <div
        className="
        hidden md:flex
        w-2/3 items-center justify-center
        bg-white
      "
      >
        <img
          src={loginIllustration}
          alt="Ilustración de contrato"
          className="w-4/5 max-w-lg object-contain"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export { LoginPage };
