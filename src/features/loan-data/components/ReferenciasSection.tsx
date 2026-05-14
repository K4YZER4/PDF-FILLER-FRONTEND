/**
 * Archivo: features/loan-data/components/ReferenciasSection.tsx
 *
 * Sección 5 del accordion: referencias personales.
 *
 * Renderiza 3 bloques idénticos (Referencia 1, 2, 3) cada uno con:
 *   - Nombre (solo letras)
 *   - Teléfono (10 dígitos)
 *
 * Los índices 0, 1, 2 corresponden a la tupla `Referencias`
 * definida en types.ts.
 */
import { NameInput, NumericInput } from "@/features/review-data/components";
import type { Referencias } from "../types";

interface ReferenciasSectionProps {
  referencias: Referencias;
  onChange: (
    index: number,
    field: "nombre" | "telefono",
    value: string,
  ) => void;
}

function ReferenciasSection({
  referencias,
  onChange,
}: ReferenciasSectionProps) {
  return (
    <div className="space-y-2">
      {([1, 2, 3] as const).map((num) => {
        const idx = num - 1;
        return (
          <div key={num} className="py-3 space-y-2">
            <p className="text-xs font-semibold text-text-secondary uppercase">
              Referencia {num}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Nombre <span className="text-error">*</span>
                </label>
                <NameInput
                  id={`ref-nombre-${num}`}
                  placeholder="Nombre completo"
                  value={referencias[idx]?.nombre ?? ""}
                  inputSize="sm"
                  success={(referencias[idx]?.nombre?.trim()?.length ?? 0) > 0}
                  onChange={(v) => onChange(idx, "nombre", v)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">
                  Teléfono <span className="text-error">*</span>
                </label>
                <NumericInput
                  id={`ref-tel-${num}`}
                  placeholder="6871234567"
                  value={referencias[idx]?.telefono ?? ""}
                  maxLength={10}
                  inputSize="sm"
                  success={(referencias[idx]?.telefono?.length ?? 0) === 10}
                  error={
                    (referencias[idx]?.telefono?.length ?? 0) > 0 &&
                    (referencias[idx]?.telefono?.length ?? 0) !== 10
                      ? "Deben ser 10 dígitos"
                      : undefined
                  }
                  onChange={(v) => onChange(idx, "telefono", v)}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ReferenciasSection };
