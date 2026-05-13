/** Layout del flujo de creación de contratos (4 pasos).
 *  Header separado del stepper.
 *  Footer moderno con acciones alineadas.
 *  Modal de confirmación al salir.
 */
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FileText, Search, Calculator, Eye, LogOut, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";
import { ContractStepper, ExitModal } from "@/layouts/components";
import type { Step } from "@/layouts/components";

const STEPS: readonly Step[] = [
  { path: "upload", label: "Documentos", icon: FileText },
  { path: "review", label: "Datos", icon: Search },
  { path: "loan", label: "Crédito", icon: Calculator },
  { path: "preview", label: "Vista previa", icon: Eye },
];

const DOC_SCAN_ITEMS = [
  { id: "ine", label: "INE" },
  { id: "nomina1", label: "Nómina 1" },
  { id: "nomina2", label: "Nómina 2" },
  { id: "estadoCuenta", label: "Estado de cuenta" },
] as const;

function ContractLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const documents = useContractStore((s) => s.documents);
  const formData = useContractStore((s) => s.formData);
  const resetContract = useContractStore((s) => s.resetContract);
  const scanDocuments = useContractStore((s) => s.scanDocuments);
  const scanStatus = useContractStore((s) => s.documents.scanStatus);
  const scanResults = useContractStore((s) => s.documents.scanResults);

  const ineFile = useContractStore((s) => s.documents.ineFile);
  const nomina1File = useContractStore((s) => s.documents.nomina1File);
  const nomina2File = useContractStore((s) => s.documents.nomina2File);
  const estadoCuentaFile = useContractStore((s) => s.documents.estadoCuentaFile);
  const allFilesLoaded = !!(ineFile && nomina1File && nomina2File && estadoCuentaFile);

  const [showExitModal, setShowExitModal] = useState(false);

  const currentStep = STEPS.findIndex((s) =>
    location.pathname.endsWith(s.path),
  );

  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;

  const handleStepNav = (path: string) => navigate(path, { relative: "path" });

  const handleExitClick = () => setShowExitModal(true);

  const handleExitCancel = () => setShowExitModal(false);

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

  const isUploadStep = location.pathname.endsWith("upload");

  const canContinue = (): boolean => {
    const path = location.pathname;

    if (path.endsWith("upload")) {
      return documents.scanStatus === "done";
    }

    if (path.endsWith("review")) {
      const { ine, nomina, banco } = formData;

      const d = (ine as any)?.domicilio || {};

      const allPersonales = [
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "curp",
        "sexo",
        "fechaNacimiento",
        "claveElector",
      ].every((f) => (ine as any)?.[f]?.trim());

      const allDomicilio = [
        "calle",
        "codigoPostal",
        "colonia",
        "noExt",
        "municipio",
        "estado",
      ].every((f) => d[f]?.trim());

      const allLaborales =
        ["rfc", "noEmpleado", "dependencia", "departamento", "puesto"].every(
          (f) => (nomina as any)?.[f]?.trim(),
        ) && Number((nomina as any)?.ingresoMensual) > 0;

      const allBancarios = ["noCuenta", "banco", "clabe"].every((f) =>
        (banco as any)?.[f]?.trim(),
      );

      return allPersonales && allDomicilio && allLaborales && allBancarios;
    }

    if (path.endsWith("loan")) {
      return formData.tabla !== null;
    }

    return false;
  };

  const goNext = () => {
    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));

    if (idx >= 0 && idx < STEPS.length - 1) {
      navigate(STEPS[idx + 1].path, { relative: "path" });
    }
  };

  const goPrev = () => {
    if (stepNumber === 1) {
      setShowExitModal(true);
      return;
    }

    const idx = STEPS.findIndex((s) => location.pathname.endsWith(s.path));

    if (idx > 0) {
      navigate(STEPS[idx - 1].path, { relative: "path" });
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
            {/* Título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                <FileText size={20} className="text-white" />
              </div>

              <h1 className="text-base font-bold text-text-primary">
                Nuevo Contrato
              </h1>
            </div>

            {/* Salir */}
            <button
              type="button"
              onClick={handleExitClick}
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
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        className="sticky bottom-0 border-t border-border backdrop-blur-sm"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={goPrev} className="w-35">
              {stepNumber === 1 ? "Cancelar" : "Volver"}
            </Button>

            {isUploadStep && scanStatus !== "done" ? (
              scanStatus === "scanning" ? (
                <Button variant="primary" disabled loading className="w-44">
                  Escaneando...
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleScan}
                  disabled={!allFilesLoaded}
                  leftIcon={<Upload size={16} />}
                  className="w-44"
                >
                  Leer documentos
                </Button>
              )
            ) : stepNumber < 4 ? (
              <Button
                variant="primary"
                onClick={goNext}
                disabled={!canContinue()}
                className="w-35"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="primary"
                className="w-35 bg-success hover:bg-success-hover"
              >
                Generar contrato
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* Overlay de escaneo con estado por documento */}
      {scanStatus === "scanning" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-primary" />
              <span className="font-medium text-text-primary">Escaneando...</span>
            </div>
            <div className="space-y-2">
              {DOC_SCAN_ITEMS.map((item) => {
                const result = scanResults[item.id];
                return (
                  <div key={item.id} className="flex items-center gap-2 text-sm">
                    {result === "success" ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : result === "error" ? (
                      <AlertCircle size={14} className="text-error" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-border" />
                    )}
                    <span className="text-text-secondary">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Modal salida */}
      {showExitModal && (
        <ExitModal onConfirm={handleExitConfirm} onCancel={handleExitCancel} />
      )}
    </div>
  );
}

export { ContractLayout };
