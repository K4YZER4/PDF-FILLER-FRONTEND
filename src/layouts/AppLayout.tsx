/**
 * Archivo: layouts/AppLayout.tsx
 * Propósito: Layout para pantallas internas que NO son parte del flujo
 * de contrato. Actualmente: Historial. En el futuro: Reportes, Configuración.
 *
 * Header sticky con:
 *   - Título de la pantalla
 *   - Botón "Nuevo contrato" (navega al flujo)
 *   - Botón cerrar sesión con modal de confirmación
 */
import { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { useContractStore } from "@/store/useContractStore";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface AppLayoutProps {
  children: ReactNode;
  /** Título que aparece en el header. Default: "Historial" */
  title?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

function AppLayout({ children, title = "Historial" }: AppLayoutProps) {
  const navigate = useNavigate();
  const logout = useContractStore((s) => s.logout);

  /** Controla la visibilidad del modal de confirmación de cierre de sesión */
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  /**
   * El usuario presiona el ícono de salir.
   * Siempre abre el modal primero — nunca ejecuta logout directamente.
   */
  const handleLogoutClick = () => setShowLogoutModal(true);

  /**
   * El usuario confirmó que quiere cerrar sesión.
   * Limpia la sesión del store y redirige al login.
   */
  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login");
  };

  /** El usuario canceló — cierra el modal sin hacer nada */
  const handleLogoutCancel = () => setShowLogoutModal(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Header sticky ── */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          {/* Título de la pantalla */}
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>

          <div className="flex items-center gap-2">
            {/*
              Botón "Nuevo contrato" — inicia el flujo de 4 pasos.
              Navega al primer paso: subir documentos.
            */}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate("/contracts/upload")}
            >
              Nuevo contrato
            </Button>

            {/*
              Botón cerrar sesión — solo muestra ícono para no
              saturar el header en móvil. El modal confirma la acción.
            */}
            <button
              type="button"
              onClick={handleLogoutClick}
              aria-label="Cerrar sesión"
              className="
                w-9 h-9 rounded-lg
                flex items-center justify-center
                text-text-secondary border border-border
                hover:bg-white hover:text-text-primary
                transition-colors
              "
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Contenido de la pantalla ── */}
      <main className="flex-1">{children}</main>

      {/*
        Modal de confirmación de cierre de sesión.
        Se renderiza solo cuando showLogoutModal=true.
        El clic en el overlay oscuro también cancela.
      */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
          aria-describedby="logout-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay — clic fuera cancela */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleLogoutCancel}
            aria-hidden="true"
          />

          {/* Tarjeta del modal */}
          <div className="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2
                id="logout-modal-title"
                className="text-base font-semibold text-text-primary"
              >
                ¿Cerrar sesión?
              </h2>
              <p
                id="logout-modal-desc"
                className="text-sm text-text-secondary leading-relaxed"
              >
                Tu sesión se cerrará y tendrás que iniciar sesión de nuevo para
                continuar.
              </p>
            </div>

            {/* Acciones — cancelar izquierda, confirmar derecha */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={handleLogoutCancel}
              >
                Cancelar
              </Button>
              <Button variant="danger" size="md" onClick={handleLogoutConfirm}>
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { AppLayout };
export type { AppLayoutProps };
