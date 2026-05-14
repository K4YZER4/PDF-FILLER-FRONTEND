/**
 * Archivo: features/loan-data/components/ContactoSection.tsx
 *
 * Sección 3 del accordion: contacto y estado civil.
 *
 * Campos:
 *   - Tel, Celular, Tel. Casa (10 dígitos cada uno)
 *   - Correo electrónico (validación básica: contiene @)
 *   - Estado Civil (selector: SOLTERO, CASADO, DIVORCIADO, UNIÓN LIBRE)
 */
import { Input } from "@/components/ui";
import { NumericInput } from "@/features/review-data/components";
import { SelectField } from "./SelectField";
import { ESTADOS_CIVILES } from "../constants";
import type { ContactoData } from "../types";

interface ContactoSectionProps {
  data: ContactoData;
  onChange: <K extends keyof ContactoData>(
    key: K,
    value: ContactoData[K],
  ) => void;
}

function ContactoSection({ data, onChange }: ContactoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Tel <span className="text-error">*</span>
        </label>
        <NumericInput
          id="tel"
          placeholder="6871234567"
          value={data.tel}
          maxLength={10}
          inputSize="sm"
          success={(data.tel?.length ?? 0) === 10}
          error={
            (data.tel?.length ?? 0) > 0 && (data.tel?.length ?? 0) !== 10
              ? "Deben ser 10 dígitos"
              : undefined
          }
          onChange={(v) => onChange("tel", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Celular <span className="text-error">*</span>
        </label>
        <NumericInput
          id="celular"
          placeholder="6871234567"
          value={data.celular}
          maxLength={10}
          inputSize="sm"
          success={(data.celular?.length ?? 0) === 10}
          error={
            (data.celular?.length ?? 0) > 0 &&
            (data.celular?.length ?? 0) !== 10
              ? "Deben ser 10 dígitos"
              : undefined
          }
          onChange={(v) => onChange("celular", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Tel. Casa <span className="text-error">*</span>
        </label>
        <NumericInput
          id="telCasa"
          placeholder="6871234567"
          value={data.telCasa}
          maxLength={10}
          inputSize="sm"
          success={(data.telCasa?.length ?? 0) === 10}
          error={
            (data.telCasa?.length ?? 0) > 0 &&
            (data.telCasa?.length ?? 0) !== 10
              ? "Deben ser 10 dígitos"
              : undefined
          }
          onChange={(v) => onChange("telCasa", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Correo <span className="text-error">*</span>
        </label>
        <Input
          id="correo"
          type="email"
          placeholder="correo@ejemplo.com"
          value={data.correo}
          inputSize="sm"
          success={data.correo?.includes?.("@") ?? false}
          onChange={(e) => onChange("correo", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Estado Civil <span className="text-error">*</span>
        </label>
        <SelectField
          id="estadoCivil"
          value={data.estadoCivil}
          onChange={(v) => onChange("estadoCivil", v)}
          options={ESTADOS_CIVILES}
          placeholder="Seleccionar"
          success={(data.estadoCivil?.length ?? 0) > 0}
        />
      </div>
    </div>
  );
}

export { ContactoSection };
