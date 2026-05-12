/**
 * Archivo: layouts/ContractLayout.tsx
 * Propósito: Layout del flujo de creación de contratos (4 pasos).
 *
 * Header:
 *   - Logo + título "Nuevo Contrato" + paso actual
 *   - Stepper visual con los 4 pasos y sus estados
 *   - Botón salir: modal de advertencia → descarta datos → regresa al historial
 *
 * Footer:
 *   - Botón "Volver" / "Cancelar" (paso 1)
 *   - Botón "Siguiente" deshabilitado si no se cumplen requisitos del paso
 *   - Botón "Generar" en el paso 4 (verde)
 *
 * Validación por paso:
 *   Paso 1 → scanStatus === "done"
 *   Paso 2 → siempre puede continuar (datos editables)
 *   Paso 3 → tabla !== null (debe haber calculado)
 *   Paso 4 → no hay siguiente, solo generar
 */
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Search,
  Calculator,
  Eye,
  CheckCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useContractStore } from "@/store/useContractStore";

// ─── Definición de pasos ──────────────────────────────────────────────────────

const STEPS = [
  { path: "upload", label: "Documentos", icon: FileText },
  { path: "review", label: "Datos", icon: Search },
  { path: "loan", label: "Crédito", icon: Calculator },
  { path: "preview", label: "Vista previa", icon: Eye },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

function ContractLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const documents = useContractStore((s) => s.documents);
  const tablaData = useContractStore((s) => s.formData.tabla);
  const resetContract = useContractStore((s) => s.resetContract);

  /** Controla la visibilidad del modal de advertencia de salida */
  const [showExitModal, setShowExitModal] = useState(false);

  // Índice del paso actual basado en la URL (0-3)
  const currentStep = STEPS.findIndex((s) =>
    location.pathname.endsWith(s.path),
  );
  // Número del paso para mostrar al usuario (1-4)
  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;

  /**
   * Valida si el asesor puede avanzar al siguiente paso.
   * Cada paso tiene sus propios requisitos.
   */
  const canContinue = (): boolean => {
    const path = location.pathname;
    if (path.endsWith("upload")) return documents.scanStatus === "done";
    if (path.endsWith("review")) return true;
    if (path.endsWith("loan")) return tablaData !== null;
    return false;
  };

  /** Navega al paso siguiente */
  const goNext = () => {
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx >= 0 && idx < STEPS.length - 1)
      navigate(STEPS[idx + 1].path, { relative: "path" });
  };

  /**
   * Navega al paso anterior.
   * En el paso 1, "Cancelar" abre el modal de advertencia
   * en lugar de navegar directamente — el asesor puede tener
   * archivos cargados que perdería sin aviso.
   */
  const goPrev = () => {
    if (stepNumber === 1) {
      setShowExitModal(true);
      return;
    }
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx > 0) navigate(STEPS[idx - 1].path, { relative: "path" });
  };

  /**
   * El usuario presiona el ícono de salir en el header.
   * Siempre muestra el modal primero.
   */
  const handleExitClick = () => setShowExitModal(true);

  /**
   * El usuario confirmó que quiere salir.
   * Descarta todos los datos del contrato en progreso
   * y regresa al historial.
   */
  const handleExitConfirm = () => {
    setShowExitModal(false);
    resetContract();
    navigate("/");
  };

  /** El usuario canceló — cierra el modal sin hacer nada */
  const handleExitCancel = () => setShowExitModal(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ── Header sticky ── */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          {/* Fila superior — título + botón salir */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-text-primary">
                  Nuevo Contrato
                </h1>
                <p className="text-xs text-text-secondary">
                  Paso {stepNumber} de 4
                </p>
              </div>
            </div>

            {/*
              Botón salir del flujo — muestra modal de advertencia.
              Está en el header para que siempre sea accesible
              sin importar el scroll de la página.
            */}
            <button
              type="button"
              onClick={handleExitClick}
              aria-label="Salir del contrato"
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

          {/* Stepper de pasos */}
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step, i) => {
              const isCurrent = i === currentStep;
              const isCompleted = i < currentStep;

              return (
                <button
                  key={step.path}
                  onClick={() => {
                    // Solo permite navegar a pasos completados o el actual
                    if (isCompleted || isCurrent)
                      navigate(step.path, { relative: "path" });
                  }}
                  disabled={!isCompleted && !isCurrent}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`
                    flex-1 flex items-center gap-1 md:gap-2
                    p-2 md:p-3 rounded-lg transition-all
                    ${isCurrent ? "bg-primary-tint text-primary" : ""}
                    ${isCompleted ? "bg-success-tint text-success" : ""}
                    ${
                      !isCurrent && !isCompleted
                        ? "bg-stone-100 text-text-secondary cursor-not-allowed opacity-60"
                        : ""
                    }
                  `}
                >
                  <div
                    className={`
                      w-6 h-6 md:w-8 md:h-8 rounded-full
                      flex items-center justify-center shrink-0
                      ${isCurrent ? "bg-primary text-white" : ""}
                      ${isCompleted ? "bg-success text-white" : ""}
                      ${!isCurrent && !isCompleted ? "bg-stone-200" : ""}
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle size={14} aria-hidden="true" />
                    ) : (
                      <step.icon size={14} aria-hidden="true" />
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs font-medium truncate">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Contenido del paso actual ── */}
      <main className="flex-1 py-6 md:py-10">
        <Outlet />
      </main>

      {/* ── Footer con navegación ── */}
      <footer className="sticky bottom-0 bg-surface border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex gap-3 md:gap-4">
          {/*
            "Cancelar" en paso 1 abre el modal (puede perder archivos).
            "Volver" en pasos 2-4 regresa al paso anterior sin modal.
          */}
          <Button
            variant="secondary"
            onClick={goPrev}
            className="flex-1 md:flex-none md:min-w-[30]"
          >
            {stepNumber === 1 ? "Cancelar" : "Volver"}
          </Button>

          {stepNumber < 4 ? (
            /*
              "Siguiente" deshabilitado hasta cumplir los requisitos
              del paso actual definidos en canContinue().
            */
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!canContinue()}
              className="flex-1 md:flex-none md:min-w-[30]"
            >
              Siguiente
            </Button>
          ) : (
            /*
              "Generar" en el paso 4 — verde para indicar
              que es la acción final positiva del flujo.
            */
            <Button
              variant="primary"
              className="flex-1 md:flex-none md:min-w-[30] bg-success hover:bg-success-hover"
            >
              Generar contrato
            </Button>
          )}
        </div>
      </footer>

      {/*
        Modal de advertencia de salida del flujo.
        Aparece cuando el asesor presiona "Salir" o "Cancelar" en paso 1.
        Descarta TODOS los datos del contrato en progreso.
      */}
      {showExitModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
          aria-describedby="exit-modal-desc"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Overlay — clic fuera cancela */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleExitCancel}
            aria-hidden="true"
          />

          {/* Tarjeta del modal */}
          <div className="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2
                id="exit-modal-title"
                className="text-base font-semibold text-text-primary"
              >
                ¿Salir del contrato?
              </h2>
              <p
                id="exit-modal-desc"
                className="text-sm text-text-secondary leading-relaxed"
              >
                Si sales ahora, los datos que ingresaste no se guardarán y
                tendrás que empezar de nuevo.
              </p>
            </div>

            {/* Acciones — cancelar izquierda, confirmar derecha */}
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" size="md" onClick={handleExitCancel}>
                Seguir editando
              </Button>
              <Button variant="danger" size="md" onClick={handleExitConfirm}>
                Salir sin guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ContractLayout };
