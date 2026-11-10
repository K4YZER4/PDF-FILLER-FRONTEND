/** Pantalla de historial de contratos generados.
 *  - Buscador por nombre del cliente.
 *  - Filtros: Todos / Semana / Hoy (TimeFilter) y por asesor (AdvisorFilter, solo admin).
 *  - Grid de ContractCard responsive (1/2/3 columnas). */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// Componentes
import { Input } from "@/components/ui";
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
import { Spinner } from "@/components";
import { EmptyState } from "@/components/feedback";
import {
  TimeFilter,
  AdvisorFilter,
  ContractCard,
} from "@/features/history/components";
// Tipos
import type { Contract } from "@/store/useContractStore";

// Imagenes
import { SearchError } from "@/assets";

// Hooks
import { useContractStore } from "@/store/useContractStore";
import { useContractFilters } from "@/features/history/hooks";
import { aprobarContrato, getHistorial, rechazarContrato, reabrirFirma } from "@/api/contracts.api";

function HistorialPage() {
  const navigate = useNavigate();
  const userRole = useContractStore((s) => s.auth.role);
  const setContracts = useContractStore((s) => s.setContracts);
  const [loading, setLoading] = useState(true);

  const [historialError, setHistorialError] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const canReview = userRole === "mesa" || userRole === "admin";

  const refreshHistory = async () => {
    const data = await getHistorial();
    setContracts(data);
  };

  useEffect(() => {
    getHistorial()
      .then((data) => setContracts(data))
      .catch(() => {
        setContracts([]);
        setHistorialError(true);
      })
      .finally(() => setLoading(false));
  }, [setContracts]);

  const {
    search,
    setSearch,
    timeFilter,
    setTimeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    advisorFilter,
    setAdvisorFilter,
    uniqueAdvisors,
    filtered,
  } = useContractFilters();

  const handleReSign = async (contract: Contract) => {
    if (contract.estado === "POR APROBAR") {
      const ok = window.confirm(
        "¿Reabrir el contrato para que el cliente vuelva a firmar? Se borrará la firma actual."
      );
      if (!ok) return;
    }

    try {
      const result = await reabrirFirma(contract.id);
      const link = result.link;
      await navigator.clipboard.writeText(link);
      const aviso = result.modoDemo
        ? "Modo demostración: no se envió correo."
        : result.mensajeCorreo ?? "Se generó un nuevo enlace de firma.";
      alert(`${aviso}\n\nEnlace copiado al portapapeles:\n${link}`);
      // Refrescar historial
      await refreshHistory();
    } catch {
      alert("No se pudo generar el nuevo enlace. Intenta de nuevo.");
    }
  };

  const openReviewDialog = (action: "approve" | "reject", contract: Contract) => {
    setSelectedContract(contract);
    setReviewAction(action);
    setRejectReason("");
    setReviewError("");
  };

  const closeReviewDialog = () => {
    if (reviewLoading) return;
    setReviewAction(null);
    setSelectedContract(null);
    setRejectReason("");
    setReviewError("");
  };

  const handleReviewConfirm = async () => {
    if (!selectedContract || !reviewAction || reviewLoading) return;
    const motivo = rejectReason.trim();
    if (reviewAction === "reject" && !motivo) {
      setReviewError("El motivo del rechazo es obligatorio.");
      return;
    }

    setReviewLoading(true);
    setReviewError("");
    try {
      if (reviewAction === "approve") {
        await aprobarContrato(selectedContract.id);
      } else {
        await rechazarContrato(selectedContract.id, motivo);
      }
      closeReviewDialog();
      await refreshHistory();
    } catch {
      setReviewError(
        reviewAction === "approve"
          ? "No se pudo aprobar el contrato. Intenta de nuevo."
          : "No se pudo rechazar el contrato. Intenta de nuevo.",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      {/* Buscador */}
      <div className="relative">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="pl-9"
        />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <TimeFilter
          value={timeFilter}
          onChange={setTimeFilter}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
        {(userRole === "admin" || userRole === "mesa") && (
          <AdvisorFilter
            value={advisorFilter}
            onChange={setAdvisorFilter}
            advisors={uniqueAdvisors}
          />
        )}
      </div>

      {/* Grid de contratos o empty state */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={historialError ? "Error al cargar contratos" : "Aún no hay contratos registrados"}
          description={historialError ? "No se pudo conectar con el servidor. Verifica que el backend esté corriendo." : "Cuando crees un contrato aparecerá aquí para poder visualizarlo y compartirlo."}
          image={SearchError}
          actionLabel="Crear contrato"
          onAction={() => navigate("/contracts/upload")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contract: Contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={() => navigate(`/contracts/view/${contract.id}`)}
              onEdit={() => navigate(`/contracts/edit/${contract.id}`)}
              onReSign={() => handleReSign(contract)}
              canReview={canReview}
              canEdit={userRole !== "mesa"}
              onApprove={() => openReviewDialog("approve", contract)}
              onReject={() => openReviewDialog("reject", contract)}
            />
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(reviewAction && selectedContract)}
        onOpenChange={(open) => {
          if (!open) closeReviewDialog();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {reviewAction === "approve" ? "¿Confirmar aprobación?" : "¿Rechazar contrato?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {reviewAction === "approve"
                ? `El contrato ${selectedContract?.id ?? ""} cambiará a APROBADO.`
                : `El contrato ${selectedContract?.id ?? ""} cambiará a RECHAZADO. Indica el motivo para continuar.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {reviewAction === "reject" && (
            <div className="space-y-2">
              <label htmlFor="reject-reason" className="text-sm font-medium text-text-primary">
                Motivo del rechazo <span className="text-error">*</span>
              </label>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(event) => {
                  setRejectReason(event.target.value);
                  setReviewError("");
                }}
                placeholder="Escribe el motivo..."
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              <div className="flex justify-between text-xs text-text-secondary">
                <span>{reviewError || "El motivo será guardado en el historial."}</span>
                <span>{rejectReason.length}/500</span>
              </div>
            </div>
          )}

          {reviewAction === "approve" && reviewError && (
            <p className="text-sm text-error" role="alert">{reviewError}</p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={reviewLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleReviewConfirm();
              }}
              className={reviewAction === "reject" ? "bg-error hover:bg-error/90" : undefined}
            >
              {reviewLoading ? "Guardando..." : reviewAction === "approve" ? "Aprobar" : "Rechazar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { HistorialPage };
