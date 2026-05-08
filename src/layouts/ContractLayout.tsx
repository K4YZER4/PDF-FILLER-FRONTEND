/** Layout del flujo de contratos con stepper de 4 pasos (Documentos → Datos → Crédito → Vista previa).
 *  - La barra de progreso muestra el paso actual, completados y pendientes.
 *  - Footer con botones Siguiente/Volver; "Siguiente" se deshabilita si no se cumple la validación del paso.
 *  - Usa <Outlet /> de React Router para renderizar el contenido del paso actual.
 *  - Paso 1 requiere scanStatus === "done", paso 3 requiere tabla !== null. */
import { Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FileText, Search, Calculator, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/shared/components";
import { useContractStore } from "@/store/useContractStore";

const STEPS = [
  { path: "upload", label: "Documentos", icon: FileText },
  { path: "review", label: "Datos", icon: Search },
  { path: "loan", label: "Crédito", icon: Calculator },
  { path: "preview", label: "Vista previa", icon: Eye },
] as const;

function ContractLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentStep = STEPS.findIndex((s) =>
    location.pathname.endsWith(s.path),
  );
  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;
  const documents = useContractStore((s) => s.documents);
  const tablaData = useContractStore((s) => s.formData.tabla);

  const canContinue = () => {
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
    if (stepNumber === 1) {
      navigate("/");
      return;
    }
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));
    if (idx > 0) navigate(STEPS[idx - 1].path, { relative: "path" });
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
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
          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step, i) => {
              const isCurrent = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <button
                  key={step.path}
                  onClick={() => {
                    if (isCompleted || isCurrent)
                      navigate(step.path, { relative: "path" });
                  }}
                  className={`flex-1 flex items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg transition-all ${isCurrent ? "bg-primary-tint text-primary" : isCompleted ? "bg-success-tint text-success" : "bg-stone-100 text-text-secondary cursor-not-allowed"}`}
                >
                  <div
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${isCurrent ? "bg-primary text-white" : isCompleted ? "bg-success text-white" : "bg-stone-200"}`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={14} />
                    ) : (
                      <step.icon size={14} />
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs font-medium">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-10">
        <Outlet />
      </main>
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex gap-3 md:gap-4">
          <Button
            variant="secondary"
            onClick={goPrev}
            className="flex-1 md:flex-none md:min-w-[120px]"
          >
            {stepNumber === 1 ? "Cancelar" : "Volver"}
          </Button>
          {stepNumber < 4 ? (
            <Button
              variant="primary"
              onClick={goNext}
              disabled={!canContinue()}
              className="flex-1 md:flex-none md:min-w-[120px]"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex-1 md:flex-none md:min-w-[120px] bg-success hover:bg-success-hover"
            >
              Generar
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

export { ContractLayout };
