/** Footer del flujo de creación de contrato.
 *  Renderiza los botones de acción según el paso actual:
 *   - Upload:   botón "Leer documentos" / "Escaneando..." / "Siguiente"
 *   - Review:   botón "Siguiente"
 *   - Loan:     botón "Generar Contrato"
 *   - Preview:  botones "Descargar", "Editar", "Compartir" + "Finalizar"
 *
 *  Props requieren todas las acciones y estados necesarios
 *  para que el padre (ContractLayout) sea la única fuente de verdad. */
import { Button } from "@/components/ui";
import {
  Upload,
  FileDown,
  Pencil,
  Share2,
  CheckCircle,
} from "lucide-react";

interface ContractFooterProps {
  currentSegment: string;
  stepNumber: number;
  canContinue: boolean;
  scanStatus: string;
  allFilesLoaded: boolean;
  isFinishing?: boolean;
  alreadyFinished?: boolean;
  onScan: () => void;
  onNext: () => void;
  onPrev: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onShare: () => void;
  onFinish: () => void;
}

function ContractFooter({
  currentSegment,
  stepNumber,
  canContinue,
  scanStatus,
  allFilesLoaded,
  isFinishing,
  alreadyFinished,
  onScan,
  onNext,
  onPrev,
  onDownload,
  onEdit,
  onShare,
  onFinish,
}: ContractFooterProps) {
  const isUploadStep = currentSegment === "upload";
  const isLoanStep = currentSegment === "loan";
  const isPreviewStep = currentSegment === "preview";

  return (
    <footer
      className="sticky bottom-0 border-t border-border backdrop-blur-sm"
      style={{ backgroundColor: "#ebebf3" }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          {/* Botón Volver / Cancelar — oculto en preview */}
          {!isPreviewStep && (
            <Button variant="secondary" onClick={onPrev} className="w-35">
              {stepNumber === 1 ? "Cancelar" : "Volver"}
            </Button>
          )}

          {/* Upload — escaneo pendiente o en progreso */}
          {isUploadStep && scanStatus !== "done" ? (
            scanStatus === "scanning" ? (
              <Button variant="primary" disabled loading className="w-44">
                Escaneando...
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={onScan}
                disabled={!allFilesLoaded}
                leftIcon={<Upload size={16} />}
                className="w-44"
              >
                Leer documentos
              </Button>
            )
          ) : stepNumber < 4 ? (
            /* Review / Loan — siguiente paso */
            <Button
              variant="primary"
              onClick={onNext}
              disabled={!canContinue}
              className={`w-44 ${isLoanStep ? "bg-success hover:bg-success-hover" : ""}`}
            >
              {isLoanStep ? "Generar Contrato" : "Siguiente"}
            </Button>
          ) : (
            /* Preview — acciones finales */
            <>
              <div className="hidden md:flex gap-3">
                <Button variant="secondary" onClick={onDownload}>
                  <FileDown size={16} /> Descargar
                </Button>
                <Button variant="secondary" onClick={onEdit}>
                  <Pencil size={16} /> Editar
                </Button>
                <Button variant="secondary" onClick={onShare}>
                  <Share2 size={16} /> Compartir
                </Button>
              </div>
              <div className="flex md:hidden gap-3">
                <Button variant="secondary" onClick={onDownload}>
                  <FileDown size={16} /> Descargar
                </Button>
                <Button variant="secondary" onClick={onEdit}>
                  <Pencil size={16} /> Editar
                </Button>
              </div>
              <Button
                variant="primary"
                onClick={onFinish}
                disabled={isFinishing || alreadyFinished}
                loading={isFinishing}
                className="w-35 bg-success hover:bg-success-hover"
              >
                {!isFinishing && !alreadyFinished && <CheckCircle size={16} />}
                {isFinishing ? "Guardando..." : alreadyFinished ? "Guardado" : "Finalizar"}
              </Button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}

export { ContractFooter };
export type { ContractFooterProps };
