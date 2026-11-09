/** Pantalla de historial de contratos generados.
 *  - Buscador por nombre del cliente.
 *  - Filtros: Todos / Semana / Hoy (TimeFilter) y por asesor (AdvisorFilter, solo admin).
 *  - Grid de ContractCard responsive (1/2/3 columnas). */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// Componentes
import { Input } from "@/components/ui";
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

  const handleApprove = async (contract: Contract) => {
    if (!window.confirm(`¿Aprobar el contrato ${contract.id}?`)) return;
    try {
      await aprobarContrato(contract.id);
      await refreshHistory();
    } catch {
      alert("No se pudo aprobar el contrato. Intenta de nuevo.");
    }
  };

  const handleReject = async (contract: Contract) => {
    const motivo = window.prompt("Escribe el motivo del rechazo:");
    if (!motivo?.trim()) return;
    try {
      await rechazarContrato(contract.id, motivo.trim());
      await refreshHistory();
    } catch {
      alert("No se pudo rechazar el contrato. Intenta de nuevo.");
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
              onView={() => navigate("/contracts/preview")}
              onEdit={() => navigate(`/contracts/edit/${contract.id}`)}
              onReSign={() => handleReSign(contract)}
              canReview={canReview}
              canEdit={userRole !== "mesa"}
              onApprove={() => void handleApprove(contract)}
              onReject={() => void handleReject(contract)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { HistorialPage };
