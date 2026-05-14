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
import { NumericInput, DateInput } from "@/features/review-data/components";
import type { AntiguedadData } from "../types";

interface AntiguedadSectionProps {
  data: AntiguedadData;
  onChange: <K extends keyof AntiguedadData>(
    key: K,
    value: AntiguedadData[K],
  ) => void;
}

function AntiguedadSection({ data, onChange }: AntiguedadSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha de Ingreso <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaIngreso"
          value={data.fechaIngreso}
          success={(data.fechaIngreso?.length ?? 0) > 0}
          onChange={(v) => onChange("fechaIngreso", v)}
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
          success={(data.anos?.length ?? 0) > 0}
          onChange={(v) => onChange("anos", v)}
        />
      </div>
    </div>
  );
}

export { AntiguedadSection };
