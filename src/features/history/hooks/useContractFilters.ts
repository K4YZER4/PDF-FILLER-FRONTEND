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
import type { Contract } from "@/store/useContractStore";

type TimeFilter = "todos" | "semana" | "hoy" | "rango";

/** Retorna true si la fecha del contrato cae dentro del filtro temporal seleccionado */
function matchesTimeFilter(
  dateStr: string,
  filter: TimeFilter,
  dateFrom?: string,
  dateTo?: string,
): boolean {
  if (filter === "todos") return true;
  const d = new Date(dateStr);
  const now = new Date();

  if (filter === "rango") {
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`) : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`) : null;
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  }

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
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  advisorFilter: string;
  setAdvisorFilter: (v: string) => void;
  uniqueAdvisors: string[];
  filtered: Contract[];
}

function useContractFilters(): UseContractFiltersReturn {
  const contracts = useContractStore((s) => s.history.contracts);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [advisorFilter, setAdvisorFilter] = useState("");

  // Extrae asesores únicos de todos los contratos para el select de filtro
  const uniqueAdvisors = useMemo(
    () => [...new Set(contracts.map((c: Contract) => c.asesor))],
    [contracts],
  );

  // Aplica los 3 filtros en cadena: temporal → asesor → búsqueda por nombre
  const filtered = useMemo(
    () =>
      contracts
        .filter((c: Contract) => matchesTimeFilter(c.date, timeFilter, dateFrom, dateTo))
        .filter((c: Contract) => !advisorFilter || c.asesor === advisorFilter)
        .filter(
          (c: Contract) =>
            !search ||
            c.clientName.toLowerCase().includes(search.toLowerCase()),
        ),
    [contracts, timeFilter, dateFrom, dateTo, advisorFilter, search],
  );

  return {
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
  };
}

export { useContractFilters };
export type { TimeFilter };
