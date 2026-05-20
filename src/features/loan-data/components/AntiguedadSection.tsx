/**
 * Archivo: features/loan-data/components/AntiguedadSection.tsx
 *
 * Sección 4 del accordion: antigüedad laboral.
 *
 * Campos:
 *   - Fecha de Ingreso (date picker)
 *   - Meses (numérico, hasta 3 dígitos)
 *   - Años (numérico, hasta 3 dígitos)
 */
import { useCallback } from "react";
import { NumericInput, DateInput } from "@/components/ui";
import type { AntiguedadData } from "../types";

interface AntiguedadSectionProps {
  data: AntiguedadData;
  onChange: <K extends keyof AntiguedadData>(
    key: K,
    value: AntiguedadData[K],
  ) => void;
}

function calcularAntiguedad(fechaIngreso: string): {
  meses: string;
  anos: string;
} {
  if (!fechaIngreso) return { meses: "", anos: "" };
  const ingreso = new Date(fechaIngreso);
  const hoy = new Date();
  let totalMeses =
    (hoy.getFullYear() - ingreso.getFullYear()) * 12 +
    hoy.getMonth() -
    ingreso.getMonth();
  if (hoy.getDate() < ingreso.getDate()) totalMeses--;
  if (totalMeses < 0) totalMeses = 0;
  return {
    meses: String(totalMeses),
    anos: String(Math.floor(totalMeses / 12)),
  };
}

function AntiguedadSection({ data, onChange }: AntiguedadSectionProps) {
  const handleFechaIngresoChange = useCallback(
    (v: string) => {
      onChange("fechaIngreso", v);
      if (v) {
        const { meses, anos } = calcularAntiguedad(v);
        onChange("meses", meses);
        onChange("anos", anos);
      }
    },
    [onChange],
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha de Ingreso <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaIngreso"
          value={data.fechaIngreso}
          maxDate={today}
          success={(data.fechaIngreso?.length ?? 0) > 0}
          onChange={handleFechaIngresoChange}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Meses <span className="text-error">*</span>
        </label>
        <NumericInput
          id="meses"
          placeholder="0"
          value={data.meses}
          maxLength={3}
          readOnly
          className="bg-bg cursor-default"
          success={(data.meses?.length ?? 0) > 0}
          onChange={(v) => onChange("meses", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Años <span className="text-error">*</span>
        </label>
        <NumericInput
          id="anos"
          placeholder="0"
          value={data.anos}
          maxLength={3}
          readOnly
          className="bg-bg cursor-default"
          success={(data.anos?.length ?? 0) > 0}
          onChange={(v) => onChange("anos", v)}
        />
      </div>
    </div>
  );
}

export { AntiguedadSection };
