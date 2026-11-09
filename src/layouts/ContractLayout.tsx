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
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
// Icons
import {
  FileText,
  Search,
  Calculator,
  Eye,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { ErrorBoundary } from "@/components/feedback";
import { Spinner } from "@/components";
import { api } from "@/lib/api";
import { useContractStore } from "@/store/useContractStore";
import { useClientName } from "@/store/selectors";
import { buildContratoPayload } from "@/utils/mapping";
import { downloadContract } from "@/utils/downloadContract";
import { updateContract } from "@/api/contracts.api";
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
import {
  ContractStepper,
  ScanOverlay,
  FinishToast,
  FloatingShareButton,
} from "@/layouts/components";
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
  const { folio } = useParams();
  const isEditMode = !!folio;

  // Store
  const formData = useContractStore((s) => s.formData);
  const resetContract = useContractStore((s) => s.resetContract);
  const scanDocuments = useContractStore((s) => s.scanDocuments);
  const scanResults = useContractStore((s) => s.documents.scanResults);
  const addContract = useContractStore((s) => s.addContract);
  const loadContractForEdit = useContractStore((s) => s.loadContractForEdit);

  const ineFile = useContractStore((s) => s.documents.ineFile);
  const nomina1File = useContractStore((s) => s.documents.nomina1File);
  const nomina2File = useContractStore((s) => s.documents.nomina2File);
  const estadoCuentaFile = useContractStore(
    (s) => s.documents.estadoCuentaFile,
  );
  const allFilesLoaded = !!(
    ineFile ||
    nomina1File ||
    nomina2File ||
    estadoCuentaFile ||
    isEditMode
  );

  // UI state
  const [showExitModal, setShowExitModal] = useState(false);
  const [showFinishToast, setShowFinishToast] = useState(false);
  const [loadingContract, setLoadingContract] = useState(isEditMode);
  const [isFinishing, setIsFinishing] = useState(false);

  // Load contract data for editing
  useEffect(() => {
    if (isEditMode && folio) {
      setLoadingContract(true);
      loadContractForEdit(folio)
        .then(() => {
          navigate("review", { relative: "path", replace: true });
        })
        .catch(() => {
          navigate("/", { replace: true });
        })
        .finally(() => setLoadingContract(false));
    }
  }, [folio]); // eslint-disable-line react-hooks/exhaustive-deps

  // Navigation
  const currentSegment =
    location.pathname.split("/").filter(Boolean).pop() ?? "";
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

  const handleDownload = async () => {
    const folio = useContractStore.getState().formData.contratoFolio;
    if (!folio) return;
    try {
      await downloadContract(folio);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error desconocido al descargar";
      alert(`No se pudo descargar el PDF:\n${msg}`);
    }
  };

  const handleEdit = () => navigate(STEPS[1].path, { relative: "path" });

  const handleFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    try {
      const payload = buildContratoPayload(formData);
      const formPayload = new FormData();
      formPayload.append("data", JSON.stringify(payload));

      let response;
      let contractFolio: string;

      if (isEditMode && folio) {
        response = await updateContract(folio, formPayload);
        contractFolio = folio;
      } else {
        response = await api.post("/api/pdfs", formPayload, {
          responseType: "blob",
        });
        contractFolio =
          response.headers?.["x-contract-folio"] ??
          response.headers?.["content-disposition"]?.match(/C-\d+/)?.[0] ??
          `CTR-${Date.now()}`;
      }

      useContractStore.getState().setFormData("contratoFolio", contractFolio);

      window.dispatchEvent(
        new CustomEvent("contract:pdf-updated", {
          detail: URL.createObjectURL(response.data as Blob),
        }),
      );

      if (!isEditMode) {
        addContract({
          id: contractFolio,
          clientName,
          date: new Date().toISOString().split("T")[0],
          monto: formData.capitalMonto || 0,
          plazo: formData.plazoQnas,
          asesor: formData.asesorData.asesor || "ASESOR",
          status: "completado",
          estado: "POR FIRMAR",
        });

      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error desconocido al guardar el contrato";
      alert(`Error al guardar el contrato:\n${msg}`);
      setIsFinishing(false);
      return;
    }

    setIsFinishing(false);
    setShowFinishToast(true);
    setTimeout(() => {
      setShowFinishToast(false);
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < 0 || currentStep >= STEPS.length - 1) return;
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
              <h1 className="text-base font-semibold text-text-primary">
                {isEditMode ? "Editar Contrato" : "Nuevo Contrato"}
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
        {loadingContract ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : (
          <ErrorBoundary context="Error al cargar la sección del contrato">
            <Outlet />
          </ErrorBoundary>
        )}
      </main>

      {/* Footer */}
      <ContractFooter
        currentSegment={currentSegment}
        stepNumber={stepNumber}
        canContinue={canContinue}
        scanStatus={scanStatus}
        allFilesLoaded={allFilesLoaded}
        isFinishing={isFinishing}
        onScan={handleScan}
        onNext={handleNext}
        onPrev={handlePrev}
        onDownload={handleDownload}
        onEdit={handleEdit}
        onShare={handleShare}
        onFinish={handleFinish}
      />

      {/* Overlay de escaneo */}
      {scanStatus === "scanning" && <ScanOverlay scanResults={scanResults} />}

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
