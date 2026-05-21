/**
 * Sección "Referencias" del accordion.
 *
 * Renderiza 3 bloques idénticos (Referencia 1, 2, 3), cada uno con
 * Nombre (NameInput) y Teléfono (NumericInput de 10 dígitos).
 *
 * Flujo de datos:
 *   - Lectura: store.formData.referencias (Zustand selector)
 *   - Escritura: setFormData("referencias", ...) con getState() para leer el
 *     array actual antes de mutarlo, evitando stale closures en las llamadas
 *     secuenciales de handleChange.
 *
 * La tupla Referencias (exactamente 3 elementos) se mapea con map en lugar de
 * mutar el array original, manteniendo inmutabilidad.
 *
 * Uso:
 *   <ReferenciasSection />
 */

import { useCallback } from "react"
import { NameInput, NumericInput } from "@/components/ui"
import { useContractStore } from "@/store/useContractStore"
import type { Referencias } from "../types"

function ReferenciasSection() {
  const setFormData = useContractStore((s) => s.setFormData)
  const referencias = useContractStore((s) => s.formData.referencias)

  const handleChange = useCallback(
    (index: number, field: "nombre" | "telefono", value: string) => {
      const current = useContractStore.getState().formData.referencias
      const next: Referencias = current.map((r, i) =>
        i === index ? { ...r, [field]: value } : r,
      ) as Referencias
      setFormData("referencias", next)
    },
    [setFormData],
  )

  return (
    <div className="space-y-2">
      {([1, 2, 3] as const).map((num) => {
        const idx = num - 1
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
                  onChange={(v) => handleChange(idx, "nombre", v)}
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
                  onChange={(v) => handleChange(idx, "telefono", v)}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { ReferenciasSection }
