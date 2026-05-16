/** Pantalla de historial de contratos generados.
 *  - Buscador por nombre del cliente.
 *  - Filtros: Todos / Semana / Hoy (TimeFilter) y por asesor (AdvisorFilter, solo admin).
 *  - Grid de ContractCard responsive (1/2/3 columnas). */
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
// Componentes
import { Input } from "@/components/ui";
import { EmptyState } from "@/components/feedback";
import {
  TimeFilter,
  AdvisorFilter,
  ContractCard,
} from "@/features/history/components";
// Tipos
import type { Contract } from "@/store/useContractStore";

// Imagenes
import emptyContract from "@/assets/empty-contracts.png";

import { useContractStore } from "@/store/useContractStore";
import { useContractFilters } from "@/features/history/hooks";

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

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      {/* Buscador */}
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

      {/* Filtros */}
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

      {/* Grid de contratos o empty state */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Aún no hay contratos registrados"
          description="Cuando crees un contrato aparecerá aquí para poder visualizarlo y compartirlo."
          image={emptyContract}
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { HistorialPage };
