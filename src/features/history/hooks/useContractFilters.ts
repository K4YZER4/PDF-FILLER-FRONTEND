/**
 * Hook que aísla toda la lógica de filtros del historial de contratos.
 * Maneja tres filtros que se componen secuencialmente:
 *   1. Temporal (todos / semana / hoy)
 *   2. Por asesor ("" = todos, o nombre del asesor)
 *   3. Búsqueda por nombre del cliente
 *
 * Retorna los estados, setters y los datos ya filtrados listos para renderizar.
 */
import { useMemo, useState } from "react";
import { useContractStore } from "@/store/useContractStore";

type TimeFilter = "todos" | "semana" | "hoy";

/** Retorna true si la fecha del contrato cae dentro del filtro temporal seleccionado */
function matchesTimeFilter(dateStr: string, filter: TimeFilter): boolean {
  if (filter === "todos") return true;
  const d = new Date(dateStr);
  const now = new Date();

  if (filter === "hoy") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }

  // semana: calcula lunes a domingo de la semana actual
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return d >= monday && d <= sunday;
}

interface UseContractFiltersReturn {
  search: string;
  setSearch: (v: string) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (v: TimeFilter) => void;
  advisorFilter: string;
  setAdvisorFilter: (v: string) => void;
  uniqueAdvisors: string[];
  filtered: any[];
}

function useContractFilters(): UseContractFiltersReturn {
  const contracts = useContractStore((s) => s.history.contracts);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("todos");
  const [advisorFilter, setAdvisorFilter] = useState("");

  // Extrae asesores únicos de todos los contratos para el select de filtro
  const uniqueAdvisors = useMemo(
    () => [...new Set(contracts.map((c: any) => c.asesor))],
    [contracts],
  );

  // Aplica los 3 filtros en cadena: temporal → asesor → búsqueda por nombre
  const filtered = useMemo(
    () =>
      contracts
        .filter((c: any) => matchesTimeFilter(c.date, timeFilter))
        .filter((c: any) => !advisorFilter || c.asesor === advisorFilter)
        .filter(
          (c: any) =>
            !search || c.clientName.toLowerCase().includes(search.toLowerCase()),
        ),
    [contracts, timeFilter, advisorFilter, search],
  );

  return {
    search, setSearch,
    timeFilter, setTimeFilter,
    advisorFilter, setAdvisorFilter,
    uniqueAdvisors, filtered,
  };
}

export { useContractFilters };
export type { TimeFilter };
