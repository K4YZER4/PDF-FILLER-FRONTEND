/** Layout del flujo de creación de contratos (4 pasos).
 *  Header con stepper + botón salir.
 *  Footer con navegación (Volver/Siguiente/Generar).
 *  Modal de confirmación al salir.
 *  Validación por paso: 1→scanStatus, 2→siempre, 3→tabla, 4→ninguna. */
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileText, Search, Calculator, Eye, LogOut } from "lucide-react";
import { Button } from "@/components/ui";
import { useContractStore } from "@/store/useContractStore";
import { ContractStepper, ExitModal } from "@/layouts/components";
import type { Step } from "@/layouts/components";

const STEPS: readonly Step[] = [
  { path: "upload", label: "Documentos", icon: FileText },
  { path: "review", label: "Datos", icon: Search },
  { path: "loan", label: "Crédito", icon: Calculator },
  { path: "preview", label: "Vista previa", icon: Eye },
];

function ContractLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const documents = useContractStore((s) => s.documents);
  const tablaData = useContractStore((s) => s.formData.tabla);
  const resetContract = useContractStore((s) => s.resetContract);
  const [showExitModal, setShowExitModal] = useState(false);

  const currentStep = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;

  const handleStepNav = (path: string) => navigate(path, { relative: "path" });
  const handleExitClick = () => setShowExitModal(true);
  const handleExitCancel = () => setShowExitModal(false);
  const handleExitConfirm = () => {
    setShowExitModal(false);
    resetContract();
    navigate("/");
  };

  const canContinue = (): boolean => {
    const path = location.pathname;
    if (path.endsWith("upload")) return documents.scanStatus === "done";
    if (path.endsWith("review")) return true;
    if (path.endsWith("loan")) return tablaData !== null;
    return false;
  };

  const goNext = () => {
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx >= 0 && idx < STEPS.length - 1)
      navigate(STEPS[idx + 1].path, { relative: "path" });
  };

  const goPrev = () => {
    if (stepNumber === 1) { setShowExitModal(true); return; }
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx > 0) navigate(STEPS[idx - 1].path, { relative: "path" });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border" style={{ backgroundColor: "#ebebf3" }}>
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-text-primary">Nuevo Contrato</h1>
                <p className="text-xs text-text-secondary">Paso {stepNumber} de 4</p>
              </div>
            </div>
            <button type="button" onClick={handleExitClick} aria-label="Salir del contrato"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-white hover:text-text-primary transition-colors"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
          <ContractStepper steps={STEPS} currentIndex={currentStep} onNavigate={handleStepNav} />
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 py-6 md:py-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-surface border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex gap-3 md:gap-4">
          <Button variant="secondary" onClick={goPrev} className="flex-1 md:flex-none md:min-w-[30]">
            {stepNumber === 1 ? "Cancelar" : "Volver"}
          </Button>
          {stepNumber < 4 ? (
            <Button variant="primary" onClick={goNext} disabled={!canContinue()} className="flex-1 md:flex-none md:min-w-[30]">
              Siguiente
            </Button>
          ) : (
            <Button variant="primary" className="flex-1 md:flex-none md:min-w-[30] bg-success hover:bg-success-hover">
              Generar contrato
            </Button>
          )}
        </div>
      </footer>

      {/* Modal salida */}
      {showExitModal && <ExitModal onConfirm={handleExitConfirm} onCancel={handleExitCancel} />}
    </div>
  );
}

export { ContractLayout };
