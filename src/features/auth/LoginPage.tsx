/** Pantalla de inicio de sesión CREDIFOM
 *  Refactorizada para usar únicamente el Design System global.
 *  - Sin colores hardcodeados
 *  - Sin bordes/radius inline
 *  - Inputs y botones reutilizables
 *  - Tipografía y espaciados consistentes
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
// Componentes
import { Button } from "@/shared/components";
import { useContractStore } from "@/store/useContractStore";
import type { UserRole } from "@/store/useContractStore";
// Assets
import loginIllustration from "@/assets/LogIn-.png";
import logo from "@/assets/Logo.png";

import "@/app/index.css";

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
    <div className="min-h-screen w-full flex bg-surface">
      {/* ─────────────────────────────────────────────
          COLUMNA IZQUIERDA
      ───────────────────────────────────────────── */}
      <div
        className="
    flex flex-col justify-center
    w-full md:w-1/3
    px-8 py-12 sm:px-14 lg:px-20
    bg-bg
  "
      >
        {/* CONTENEDOR GLOBAL */}
        <div className="w-full max-w-sm mx-auto">
          {/* ───────────────── Logo ───────────────── */}
          <div className="mb-10 flex justify-center">
            <img
              src={logo}
              alt="CREDIFOM"
              className="h-10 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* ───────────────── Header ───────────────── */}
          <div className="mb-8 text-center">
            <h1
              className="
          hidden md:block
          text-3xl
          font-bold
          text-text-primary
        "
            >
              Bienvenido
            </h1>

            <p
              className="
          hidden md:block
          mt-2
          text-sm
          text-text-secondary
        "
            >
              Inicia sesión para comenzar a trabajar.
            </p>

            <h1
              className="
          md:hidden
          text-3xl
          font-bold
          text-text-primary
        "
            >
              Iniciar sesión
            </h1>
          </div>

          {/* ───────────────── Formulario ───────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Usuario */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="
            text-sm
            font-medium
            text-text-secondary
          "
              >
                Usuario
              </label>

              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Usuario"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="input"
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="
            text-sm
            font-medium
            text-text-secondary
          "
              >
                Contraseña
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="input pr-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  className="
              absolute inset-y-0 right-3
              flex items-center
              text-text-muted
              hover:text-text-secondary
              transition-colors
            "
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Recuperar contraseña */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="
            text-sm
            font-medium
            text-primary
            hover:underline
          "
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Recordar sesión */}
            <div className="hidden md:flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                ¿Recordar sesión?
              </span>

              <button
                type="button"
                role="switch"
                aria-checked={remember}
                onClick={() => setRemember((v) => !v)}
                className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${remember ? "bg-primary" : "bg-border-strong"}
          `}
              >
                <span
                  className={`
              inline-block h-4 w-4 rounded-full bg-surface shadow-sm transition-transform
              ${remember ? "translate-x-6" : "translate-x-1"}
            `}
                />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                className="
            flex items-center gap-2
            rounded-lg border
            border-error-subtle
            bg-error-tint
            p-3
            text-sm
            text-error
          "
              >
                <AlertCircle size={16} />

                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full">
              Iniciar sesión
            </Button>

            {/* Footer */}
            <p
              className="
          text-center
          text-sm
          text-text-secondary
        "
            >
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="
            font-medium
            text-primary
            hover:underline
          "
              >
                Solicita una
              </button>
            </p>
          </form>

          {/* ───────────────── Credenciales ───────────────── */}
          <div
            className="
        mt-10
        rounded-lg
        border border-border
        bg-surface
        p-4
        text-xs
        text-text-secondary
        shadow-xs
      "
          >
            <p className="mb-2 font-semibold text-text-primary">
              Credenciales de prueba
            </p>

            <div className="space-y-1">
              <p>
                <span className="font-medium">Asesor:</span> asesor@credifom.mx
                / 1234
              </p>

              <p>
                <span className="font-medium">Admin:</span> admin@credifom.mx /
                1234
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          COLUMNA DERECHA
      ───────────────────────────────────────────── */}
      <div
        className="
          hidden md:flex
          w-2/3
          items-center justify-center
          bg-surface
        "
      >
        <img
          src={loginIllustration}
          alt="Ilustración de contrato"
          aria-hidden="true"
          className="
            w-4/5
            max-w-xl
            object-contain
          "
        />
      </div>
    </div>
  );
}

export { LoginPage };
