/**
 * Archivo: features/loan-data/components/PrestamoSection.tsx
 *
 * Sección 1 del accordion: datos del préstamo.
 *
 * Contiene:
 *   - Input de monto neto (múltiplo de 1000)
 *   - Botones de plazo en quincenas (24, 36, 48, 72, 96, 120)
 *   - Botón "Calcular" que ejecuta el cálculo simulado
 *   - Grid con resultados: monto pagaré, descuento quincenal, tasa mensual, CAT
 */
import { TrendingUp } from "lucide-react"
import { Button, Input } from "@/components/ui"
import type { ResultadoCalculo } from "../types"
import { PLAZOS_QNA } from "../constants"

interface PrestamoSectionProps {
  monto: string
  plazo: number
  isCalculando: boolean
  resultado: ResultadoCalculo | null
  isComplete: boolean
  onMontoChange: (value: string) => void
  onPlazoChange: (value: number) => void
  onCalcular: () => void
}

function PrestamoSection({
  monto, plazo, isCalculando, resultado, isComplete,
  onMontoChange, onPlazoChange, onCalcular,
}: PrestamoSectionProps) {
  const montoNum   = Number(monto)
  const montoError = monto !== "" && (montoNum <= 0 || montoNum % 1000 !== 0)
    ? "Debe ser múltiplo de 1000"
    : undefined

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Monto neto (capital)</label>
          <Input
            type="number"
            placeholder="Ej: 15000"
            value={monto}
            inputSize="sm"
            success={isComplete}
            error={montoError}
            onChange={(e) => onMontoChange(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">Plazo (quincenas)</label>
          <div className="flex gap-2 flex-wrap">
            {PLAZOS_QNA.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onPlazoChange(q)}
                className={`
                  px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                  ${plazo === q
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-text-secondary border-border hover:border-primary"
                  }
                `}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={onCalcular}
        loading={isCalculando}
        disabled={!monto || montoNum <= 0 || montoNum % 1000 !== 0}
        leftIcon={<TrendingUp size={16} />}
      >
        Calcular
      </Button>

      {resultado && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monto pagaré",        value: `$${resultado.montoPagare.toLocaleString("es-MX")}` },
            { label: "Desc. quincenal",      value: `$${resultado.descuentoQuincenal.toLocaleString("es-MX")}` },
            { label: "Tasa mensual",         value: `${(resultado.tasaMensual * 100).toFixed(1)}%` },
            { label: "CAT anual",            value: `${(resultado.cat * 100).toFixed(1)}%` },
          ].map((item) => (
            <div key={item.label} className="bg-bg border border-border rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-1">{item.label}</p>
              <p className="text-lg font-semibold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { PrestamoSection }
