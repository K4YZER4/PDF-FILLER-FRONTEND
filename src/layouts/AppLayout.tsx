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
// Icons
import { Plus, LogOut } from "lucide-react";
// Componentes
import { Button } from "@/components/ui";
import { ErrorBoundary } from "@/components/feedback";

// Componentes para el modal de confirmación
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui";

// Hooks
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
  const userRole = useContractStore((s) => s.auth.role);

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

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Header sticky ── */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-text-primary">{title}</h1>

          <div className="flex items-center gap-2">
             {userRole !== "mesa" && <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={16} />}
              onClick={() => navigate("/contracts/upload")}
            >
              Nuevo contrato
             </Button>}

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
      <ErrorBoundary context="Error al cargar la pantalla">
        <main className="flex-1">{children}</main>
      </ErrorBoundary>

      {/* Modal cerrar sesión */}
      {showLogoutModal && (
        <AlertDialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
          <AlertDialogContent
            className="
              w-[92%]
              max-w-md
              rounded-2xl
              p-5
              sm:p-6
            "
          >
            <AlertDialogHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-error/10">
                <LogOut className="text-error" size={26} />
              </div>

              <AlertDialogTitle className="text-xl">
                ¿Cerrar sesión?
              </AlertDialogTitle>

              <AlertDialogDescription className="mt-2">
                Tu sesión se cerrará y tendrás que iniciar sesión nuevamente
                para continuar.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1 h-12">
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleLogoutConfirm}
                className="flex-1 h-12 bg-error hover:bg-error/90"
              >
                Cerrar sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export { AppLayout };
export type { AppLayoutProps };
