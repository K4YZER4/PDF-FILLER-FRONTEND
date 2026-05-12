/** Pantalla de historial de contratos generados.
 *  - Buscador por nombre del cliente.
 *  - Filtros: Todos / Semana / Hoy (TimeFilter) y por asesor (AdvisorFilter, solo admin).
 *  - Grid de tarjetas responsive (1/2/3 columnas).
 *  - Cada tarjeta muestra: nombre, fecha, asesor, monto, plazo, badge de estado.
 *  - Botones: Ver (navega a preview) y Compartir (navigator.share con fallback clipboard). */
import { useNavigate } from "react-router-dom";
import { Eye, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import { Card } from "@/features/history/componenrs/index";
import emptyContract from "@/assets/empty-contracts.png";
import { useContractStore } from "@/store/useContractStore";
import { useContractFilters } from "@/features/history/hooks";
import { TimeFilter, AdvisorFilter } from "@/features/history/components";

function HistorialPage() {
  const navigate = useNavigate();
  const userRole = useContractStore((s) => s.auth.role);
  const {
    search,
    setSearch,
    timeFilter,
    setTimeFilter,
    advisorFilter,
    setAdvisorFilter,
    uniqueAdvisors,
    filtered,
  } = useContractFilters();

  const handleShare = async (contract: any) => {
    const url = `${window.location.origin}/contracts/preview`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contrato ${contract.id}`,
          text: `Contrato de ${contract.clientName}`,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    // Buscador
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
          className="pl-9"
        />
      </div>

      {/* Fila de filtros: temporal arriba, asesor abajo en móvil / lado a lado en desktop */}
      <div className="flex items-center gap-2">
        <TimeFilter value={timeFilter} onChange={setTimeFilter} />
        {userRole === "admin" && (
          <AdvisorFilter
            value={advisorFilter}
            onChange={setAdvisorFilter}
            advisors={uniqueAdvisors}
          />
        )}
      </div>

      {/* Esto se muestra si no hay contratos */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Aún no hay contratos registrados"
          description="Cuando crees un contrato aparecerá aquí para poder visualizarlo, compartirlo y darle seguimiento."
          image={emptyContract}
          actionLabel="Crear contrato"
          onAction={() => navigate("/contracts/upload")}
        />
      ) : (
        // Cards de contratos
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contract: any) => (
            <Card
              key={contract.id}
              className="p-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {contract.clientName}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {contract.date} · {contract.asesor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-text-secondary">Monto</p>
                    <p className="font-semibold text-money">
                      ${contract.monto?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Plazo</p>
                    <p className="font-semibold">{contract.plazo} QNAs</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/contracts/preview`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleShare(contract)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export { HistorialPage };
