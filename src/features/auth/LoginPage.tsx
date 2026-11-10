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
import { login as loginApi } from "@/api/auth.api";
import { isDemoMode } from "@/lib/demoKey";

// Imagenes
import { LogInIllustration, LogoIlustration } from "@/assets";

// ─── Validación ──────────────────────────────────────────────────────────────
// Se usa la libreria zod para definir un esquema de validación del formulario de login.
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El usuario es requerido")
    .min(1, "Ingresa tu usuario o correo"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(4, "Mínimo 4 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const demoUsers = [
  { role: "Asesor", username: "juanp", password: "Demo1234!" },
  { role: "Administrador", username: "admin", password: "Demo1234!" },
  { role: "Mesa de Control", username: "mesa", password: "Demo1234!" },
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");

    try {
      const result = await loginApi(data, remember);
      login(result.user.email, result.user.role, result.user.profile);
      navigate("/app");
    } catch (error: unknown) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Correo o contraseña incorrectos. Intenta de nuevo.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-surface">
      {/* ── Columna izquierda — formulario ── */}
      <div className="flex flex-col justify-center w-full lg:w-1/3 px-8 py-12 sm:px-14 lg:px-20 bg-bg">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <img
              src={LogoIlustration}
              alt="CREDIFOM"
              className="h-10 w-auto"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Título */}
          <div className="mb-15 text-center">
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

          {isDemoMode() && (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
                Usuarios de prueba
              </p>
              <div className="space-y-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.role}
                    type="button"
                    onClick={() => {
                      setValue("email", user.username);
                      setValue("password", user.password);
                      setServerError("");
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-border bg-bg px-3 py-2 text-left transition hover:border-primary hover:bg-primary/5"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-text-primary">{user.role}</span>
                      <span className="block text-xs text-text-secondary">{user.username} · {user.password}</span>
                    </span>
                    <span className="text-xs font-semibold text-primary">Usar</span>
                  </button>
                ))}
              </div>
            </div>
          )}

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
               label="Usuario o correo"
              required
               type="text"
               placeholder="juanp o juan@test.com"
              autoComplete="username"
              error={errors.email?.message}
              maxLength={25}
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
              maxLength={25}
              {...register("password", { onChange: () => setServerError("") })}
            />

            {/* Recuperar contraseña */}
            {/* Cuando se integre el recuperr contraseña se desdocumentara esta parte */}
            {/* <div className="flex justify-end">
              <button
                type="button"
                className="text-sm font-medium text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div> */}

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
              no coinciden con ningún usuario registrado.
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

            {/* Cuando se implemente solicitar contraseña se descomentara este bloque */}
            {/* <p className="text-center text-sm text-text-secondary">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className="font-medium text-primary hover:underline"
              >
                Solicita una
              </button>
            </p> */}
          </form>
        </div>
      </div>

      {/* ── Columna derecha — ilustración ── */}
      <div className="hidden lg:flex w-2/3 items-center justify-center bg-surface">
        <img
          src={LogInIllustration}
          alt="Ilustración de contrato"
          aria-hidden="true"
          className="w-4/5 max-w-xxl object-contain"
        />
      </div>
    </div>
  );
}

export { LoginPage };
