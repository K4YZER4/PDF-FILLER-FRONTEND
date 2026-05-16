/** Layout del flujo de creación de contratos (4 pasos).
 *  Header separado del stepper.
 *  Footer moderno con acciones alineadas.
 *  Modal de confirmación al salir.
 */
import { useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Search,
  Calculator,
  Eye,
  LogOut,
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileDown,
  Pencil,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Card } from "@/components";
import { ErrorBoundary } from "@/components/feedback";
import { useContractStore } from "@/store/useContractStore";
import { ContractStepper } from "@/layouts/components";
import type { Step } from "@/layouts/components";
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
} from "@/components/ui/alert-dialog";

import { TriangleAlert } from "lucide-react";

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
  const store = useContractStore();
  const resetContract = useContractStore((s) => s.resetContract);
  const scanDocuments = useContractStore((s) => s.scanDocuments);
  const scanStatus = useContractStore((s) => s.documents.scanStatus);
  const scanResults = useContractStore((s) => s.documents.scanResults);

  const ineFile = useContractStore((s) => s.documents.ineFile);
  const nomina1File = useContractStore((s) => s.documents.nomina1File);
  const nomina2File = useContractStore((s) => s.documents.nomina2File);
  const estadoCuentaFile = useContractStore(
    (s) => s.documents.estadoCuentaFile,
  );
  const allFilesLoaded = !!(
    ineFile &&
    nomina1File &&
    nomina2File &&
    estadoCuentaFile
  );

  const [showExitModal, setShowExitModal] = useState(false);

  const currentSegment = location.pathname.split("/").filter(Boolean).pop();
  const currentStep = STEPS.findIndex((s) => s.path === currentSegment);

  const stepNumber = currentStep >= 0 ? currentStep + 1 : 1;

  const handleStepNav = (path: string) => navigate(path, { relative: "path" });

  const handleExitClick = () => setShowExitModal(true);

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

  const isUploadStep = currentSegment === "upload";
  const isLoanStep = currentSegment === "loan";
  const isPreviewStep = currentSegment === "preview";

  const addContract = useContractStore((s) => s.addContract);

  const [showFinishToast, setShowFinishToast] = useState(false);

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
      clientName:
        [
          formData.ine.primerNombre,
          formData.ine.segundoNombre,
          formData.ine.primerApellido,
          formData.ine.segundoApellido,
        ]
          .filter(Boolean)
          .join(" ")
          .toUpperCase() || "CLIENTE",
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

  const handleShare = useCallback(async () => {
    const text = `Contrato CREDIFOM\nCliente: ${
      [formData.ine.primerNombre, formData.ine.primerApellido]
        .filter(Boolean)
        .join(" ") || "CLIENTE"
    }\nMonto: $${(formData.tabla?.montoPagare ?? 0).toLocaleString()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Contrato CREDIFOM", text });
      } catch {
        /* usuario canceló */
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Información copiada al portapapeles");
    }
  }, [formData]);

  const canContinue = (): boolean => {
    if (currentSegment === "upload") {
      return documents.scanStatus === "done";
    }

    if (currentSegment === "review") {
      const { ine, nomina, banco } = formData;
      const d = ine.domicilio;

      const allPersonales = [
        ine.primerNombre,
        ine.segundoNombre,
        ine.primerApellido,
        ine.segundoApellido,
        ine.curp,
        ine.sexo,
        ine.fechaNacimiento,
        ine.claveElector,
      ].every((f) => f?.trim());

      const allDomicilio = [
        d?.calle,
        d?.codigoPostal,
        d?.colonia,
        d?.noExt,
        d?.municipio,
        d?.estado,
      ].every((f) => f?.trim());

      const laboralFields = [
        nomina.rfc,
        nomina.noEmpleado,
        nomina.dependencia,
        nomina.departamento,
        nomina.puesto,
      ];
      const allLaborales =
        laboralFields.every((f) => f?.trim()) &&
        Number(nomina.ingresoMensual) > 0;

      const allBancarios = [banco.noCuenta, banco.banco, banco.clabe].every(
        (f) => f?.trim(),
      );

      return allPersonales && allDomicilio && allLaborales && allBancarios;
    }

    if (currentSegment === "loan") {
      const m = formData.capitalMonto;
      if (m <= 0 || m % 1000 !== 0) return false;

      const ad = formData.asesorData;
      const cd = formData.contactoData;
      const ant = formData.antiguedadData;
      const refs = formData.referencias;

      if ((ad.folio?.length ?? 0) !== 5) return false;
      if (!ad.sucursal?.trim()) return false;
      if ((ad.numVendedor?.length ?? 0) !== 3) return false;
      if (!ad.asesor?.trim()) return false;
      if (!ad.fechaContrato) return false;
      if (!ad.fechaArranque) return false;
      if (!ad.lugar?.trim()) return false;
      if (!ad.mesDescuento) return false;
      if ((ad.anioDescuento?.length ?? 0) !== 4) return false;

      if ((cd.tel?.length ?? 0) !== 10) return false;
      if ((cd.celular?.length ?? 0) !== 10) return false;
      if ((cd.telCasa?.length ?? 0) !== 10) return false;
      if (!cd.correo?.includes("@")) return false;
      if (!cd.estadoCivil) return false;

      if (!ant.fechaIngreso) return false;
      if (!ant.meses?.length) return false;
      if (!ant.anos?.length) return false;

      return refs.every(
        (r) => r?.nombre?.trim() && (r?.telefono?.length ?? 0) === 10,
      );
    }

    return false;
  };

  const goNext = () => {
    if (currentStep >= 0 && currentStep < STEPS.length - 1) {
      if (currentSegment === "loan") {
        const monto = formData.capitalMonto;
        if (monto <= 0 || monto % 1000 !== 0) {
          alert("Introduzca un monto válido (múltiplo de 1000)");
          return;
        }
        if (!formData.tabla) {
          const plazo = formData.plazoQnas || 48;
          store.setFormData("tabla", {
            montoPagare: monto * 1.15,
            descuentoQuincenal: (monto * 1.15) / plazo,
            tasaMensual: 0.025,
            cat: 0.32,
          });
        }
      }
      navigate(STEPS[currentStep + 1].path, { relative: "path" });
    }
  };

  const goPrev = () => {
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
        <ErrorBoundary context="Error al cargar la sección del contrato">
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer
        className="sticky bottom-0 border-t border-border backdrop-blur-sm"
        style={{ backgroundColor: "#ebebf3" }}
      >
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            {!isPreviewStep && (
              <Button variant="secondary" onClick={goPrev} className="w-35">
                {stepNumber === 1 ? "Cancelar" : "Volver"}
              </Button>
            )}

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
              isLoanStep ? (
                <Button
                  variant="primary"
                  onClick={goNext}
                  disabled={!canContinue()}
                  className="w-44 bg-success hover:bg-success-hover"
                >
                  Generar Contrato
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={goNext}
                  disabled={!canContinue()}
                  className="w-44"
                >
                  Siguiente
                </Button>
              )
            ) : isPreviewStep ? (
              <>
                <div className="hidden md:flex gap-3">
                  <Button variant="secondary" onClick={handleDownload}>
                    <FileDown size={16} /> Descargar
                  </Button>
                  <Button variant="secondary" onClick={handleEdit}>
                    <Pencil size={16} /> Editar
                  </Button>
                  <Button variant="secondary" onClick={handleShare}>
                    <Share2 size={16} /> Compartir
                  </Button>
                </div>
                <div className="flex md:hidden gap-3">
                  <Button variant="secondary" onClick={handleDownload}>
                    <FileDown size={16} /> Descargar
                  </Button>
                  <Button variant="secondary" onClick={handleEdit}>
                    <Pencil size={16} /> Editar
                  </Button>
                </div>
                <Button
                  variant="primary"
                  onClick={handleFinish}
                  className="w-35 bg-success hover:bg-success-hover"
                >
                  <CheckCircle size={16} /> Finalizar
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                className="w-44 bg-success hover:bg-success-hover"
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
              <span className="font-medium text-text-primary">
                Escaneando...
              </span>
            </div>
            <div className="space-y-2">
              {DOC_SCAN_ITEMS.map((item) => {
                const result = scanResults[item.id];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 text-sm"
                  >
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

      {/* Floating share button — solo móvil */}
      {isPreviewStep && (
        <button
          type="button"
          onClick={handleShare}
          aria-label="Compartir contrato"
          className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-hover transition-all active:scale-95"
        >
          <Share2 size={22} />
        </button>
      )}

      {/* Toast de finalización */}
      {showFinishToast && (
        <div className="fixed top-6 right-6 z-999 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-success-tint border border-success/20 text-success px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} /> Contrato generado exitosamente
          </div>
        </div>
      )}

      {/* Modal salida */}
      {showExitModal && (
        <AlertDialog open={showExitModal} onOpenChange={setShowExitModal}>
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
