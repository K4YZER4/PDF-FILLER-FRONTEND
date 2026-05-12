/**
 * Archivo: features/auth/LoginPage.tsx
 * Propósito: Pantalla de inicio de sesión CREDIFOM.
 * Usa el componente Input del design system para todos los campos.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Componentes
import { Input, Button } from "@/components/ui/index";
import { Toggle } from "@/features/auth/components/Toggle";

import { useContractStore } from "@/store/useContractStore";
import type { UserRole } from "@/store/useContractStore";

import loginIllustration from "@/assets/LogIn-.png";
import logo from "@/assets/Logo.png";

// ─── Validación ──────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El usuario es requerido")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(4, "Mínimo 4 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Mock usuarios ───────────────────────────────────────────────────────────

const MOCK_USERS: { email: string; password: string; role: UserRole }[] = [
  { email: "asesor@credifom.mx", password: "1234", role: "asesor" },
  { email: "admin@credifom.mx", password: "1234", role: "admin" },
];

// ─── Componente ──────────────────────────────────────────────────────────────

function LoginPage() {
  const [remember, setRemember] = useState(true);
  const [serverError, setServerError] = useState("");

  const login = useContractStore((s) => s.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setServerError("");

    const user = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password,
    );

    if (!user) {
      setServerError("Correo o contraseña incorrectos. Intenta de nuevo.");
      return;
    }

    login(user.email, user.role);
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-surface">
      {/* ── Columna izquierda — formulario ── */}
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-8 py-12 sm:px-14 lg:px-20 bg-bg">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
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

          {/* Título */}
          <div className="mb-8 text-center">
            <h1 className="hidden lg:block text-3xl font-bold text-text-primary">
              Bienvenido
            </h1>
            <p className="hidden lg:block mt-2 text-sm text-text-secondary">
              Inicia sesión para comenzar a trabajar.
            </p>
            <h1 className="lg:hidden text-3xl font-bold text-text-primary">
              Iniciar sesión
            </h1>
          </div>

          {/* Formulario */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/*
              Input de usuario — usa react-hook-form via {...register()}
              El error de zod se pasa directamente como prop error
            */}
            <Input
              id="email"
              label="Usuario"
              required
              type="email"
              placeholder="asesor@credifom.mx"
              autoComplete="username"
              error={errors.email?.message}
              {...register("email", { onChange: () => setServerError("") })}
            />

            {/*
              Input de contraseña — el toggle del ojo está integrado
              en el componente, no hace falta manejarlo aquí
            */}
            <Input
              id="password"
              label="Contraseña"
              required
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register("password", { onChange: () => setServerError("") })}
            />

            {/* Recuperar contraseña */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Recordar sesión — solo desktop */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                ¿Recordar sesión?
              </span>
              {/*
                Toggle es un componente separado del Input —
                es un switch, no un campo de texto
              */}
              <Toggle
                checked={remember}
                onChange={setRemember}
                aria-label="Recordar sesión"
              />
            </div>

            {/*
              Error de servidor — aparece cuando las credenciales
              no coinciden con ningún usuario mock.
              Es distinto al error de validación de cada campo.
            */}
            {serverError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-error-border bg-error-tint p-3 text-sm text-error"
              >
                <AlertCircle size={16} aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
            >
              Iniciar sesión
            </Button>

            <p className="text-center text-sm text-text-secondary">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Solicita una
              </button>
            </p>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-10 rounded-lg border border-border bg-surface p-4 text-xs text-text-secondary">
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

      {/* ── Columna derecha — ilustración ── */}
      <div className="hidden lg:flex w-2/3 items-center justify-center bg-surface">
        <img
          src={loginIllustration}
          alt="Ilustración de contrato"
          aria-hidden="true"
          className="w-4/5 max-w-xl object-contain"
        />
      </div>
    </div>
  );
}

export { LoginPage };
