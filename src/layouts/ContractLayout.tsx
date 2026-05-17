/** Layout del flujo de creación de contratos (4 pasos).
 *  Orquesta la navegación entre pasos, el escaneo de documentos,
 *  la validación por paso, y las acciones de finalización.
 *
 *  Responsabilidades (separadas en módulos):
 *   - useStepValidation  → valida campos del paso actual
 *   - useShareContract   → lógica de compartir vía Web Share API
 *   - ContractFooter     → renderiza botones según el paso
 *   - ContractStepper    → indicador visual de progreso
 *   - ScanOverlay        → modal de progreso de escaneo
 *   - FinishToast        → notificación de contrato generado
 *   - FloatingShareButton → FAB de compartir en móvil
 *   - AlertDialog        → confirmación al salir */
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Search,
  Calculator,
  Eye,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { ErrorBoundary } from "@/components/feedback";
import { useContractStore } from "@/store/useContractStore";
import { useClientName } from "@/store/selectors";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ContractStepper, ScanOverlay, FinishToast, FloatingShareButton } from "@/layouts/components";
import { ContractFooter } from "@/layouts/components/ContractFooter";
import { useStepValidation } from "@/layouts/hooks/useStepValidation";
import { useShareContract } from "@/layouts/hooks/useShareContract";
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

  // Store
  const formData = useContractStore((s) => s.formData);
  const resetContract = useContractStore((s) => s.resetContract);
  const scanDocuments = useContractStore((s) => s.scanDocuments);
  const scanResults = useContractStore((s) => s.documents.scanResults);
  const setFormData = useContractStore((s) => s.setFormData);
  const addContract = useContractStore((s) => s.addContract);

  const ineFile = useContractStore((s) => s.documents.ineFile);
  const nomina1File = useContractStore((s) => s.documents.nomina1File);
  const nomina2File = useContractStore((s) => s.documents.nomina2File);
  const estadoCuentaFile = useContractStore((s) => s.documents.estadoCuentaFile);
  const allFilesLoaded = !!(ineFile && nomina1File && nomina2File && estadoCuentaFile);

  // UI state
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishToast, setShowFinishToast] = useState(false);

  // Navigation
  const currentSegment = location.pathname.split("/").filter(Boolean).pop() ?? "";
  const currentStep = STEPS.findIndex((s) => s.path === currentSegment);
  const stepNumber = Math.max(currentStep + 1, 1);
  const canContinue = useStepValidation(currentSegment);
  const isPreviewStep = currentSegment === "preview";

  const clientName = useClientName();
  const scanStatus = useContractStore((s) => s.documents.scanStatus);

  // Hooks
  const handleShare = useShareContract();

  const handleStepNav = (path: string) => navigate(path, { relative: "path" });

  const handleExitConfirm = () => {
    setShowExitModal(false);
    resetContract();
    navigate("/");
  };

  const handleScan = async () => {
    const result = await scanDocuments();
    if (result === "done") {
      navigate(STEPS[1].path, { relative: "path" });
    }
  };

  const handleDownload = () => {
    const blob = new Blob(["Contrato PDF"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEdit = () => navigate(STEPS[1].path, { relative: "path" });

  const handleFinish = () => {
    setShowFinishToast(true);
    addContract({
      id: `CTR-${Date.now()}`,
      clientName,
      date: new Date().toISOString().split("T")[0],
      monto: formData.tabla?.montoPagare ?? 0,
      plazo: formData.plazoQnas,
      asesor: formData.asesorData.asesor || "ASESOR",
      status: "completado",
    });
    setTimeout(() => {
      setShowFinishToast(false);
      navigate("/");
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < 0 || currentStep >= STEPS.length - 1) return;

    if (currentSegment === "loan") {
      const monto = formData.capitalMonto;
      if (monto <= 0 || monto % 1000 !== 0) {
        alert("Introduzca un monto válido (múltiplo de 1000)");
        return;
      }
      if (!formData.tabla) {
        const plazo = formData.plazoQnas || 48;
        setFormData("tabla", {
          montoPagare: monto * 1.15,
          descuentoQuincenal: (monto * 1.15) / plazo,
          tasaMensual: 0.025,
          cat: 0.32,
        });
      }
    }

    navigate(STEPS[currentStep + 1].path, { relative: "path" });
  };

  const handlePrev = () => {
    if (stepNumber === 1) {
      setShowExitModal(true);
      return;
    }
    if (currentStep > 0) {
      navigate(STEPS[currentStep - 1].path, { relative: "path" });
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                <FileText size={20} className="text-white" />
              </div>
              <h1 className="text-base font-bold text-text-primary">
                Nuevo Contrato
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setShowExitModal(true)}
              aria-label="Salir del contrato"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-white hover:text-text-primary transition-colors"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <section className="bg-bg">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="rounded-2xl p-3">
            <ContractStepper
              steps={STEPS}
              currentIndex={currentStep}
              onNavigate={handleStepNav}
            />
          </div>
        </div>
      </section>

      {/* Contenido */}
      <main className="flex-1 py-3 md:py-4">
        <ErrorBoundary context="Error al cargar la sección del contrato">
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <ContractFooter
        currentSegment={currentSegment}
        stepNumber={stepNumber}
        canContinue={canContinue}
        scanStatus={scanStatus}
        allFilesLoaded={allFilesLoaded}
        onScan={handleScan}
        onNext={handleNext}
        onPrev={handlePrev}
        onDownload={handleDownload}
        onEdit={handleEdit}
        onShare={handleShare}
        onFinish={handleFinish}
      />

      {/* Overlay de escaneo */}
      {scanStatus === "scanning" && (
        <ScanOverlay scanResults={scanResults} />
      )}

      {/* Floating share button — solo móvil */}
      {isPreviewStep && <FloatingShareButton onShare={handleShare} />}

      {/* Toast de finalización */}
      <FinishToast show={showFinishToast} />

      {/* Modal de confirmación al salir */}
      {showExitModal && (
        <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
          <AlertDialogContent className="w-[92%] max-w-md rounded-2xl p-5 sm:p-6">
            <AlertDialogHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-error/10">
                <TriangleAlert className="text-error" size={28} />
              </div>
              <AlertDialogTitle className="text-xl">
                ¿Salir del contrato?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2">
                Se perderán todos los datos capturados del contrato actual. Esta
                acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1 h-12">
                Continuar editando
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleExitConfirm}
                className="flex-1 h-12 bg-error hover:bg-error/90"
              >
                Salir y descartar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export { ContractLayout };
