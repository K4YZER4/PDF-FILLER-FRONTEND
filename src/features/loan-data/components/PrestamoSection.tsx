import { TrendingUp, MapPin } from "lucide-react"
import { Button, Input, NameInput, NumericInput, DateInput } from "@/components/ui"
import { Spinner } from "@/components/Spinner"
import { SelectField } from "./SelectField"
import type { TablaCreditoData } from "../types"
import { PLAZOS_QNA, MESES } from "../constants"

interface PrestamoSectionProps {
  monto: string
  plazo: number
  isCalculando: boolean
  resultado: TablaCreditoData | null
  isComplete: boolean
  onMontoChange: (value: string) => void
  onPlazoChange: (value: number) => void
  onCalcular: () => void

  fechaArranque: string
  lugar: string
  mesDescuento: string
  anioDescuento: string
  isAutoFilled: boolean
  detectingLocation?: boolean
  onAsesorFieldChange: (field: string, value: string) => void
}

function PrestamoSection({
  monto,
  plazo,
  isCalculando,
  resultado,
  isComplete,
  onMontoChange,
  onPlazoChange,
  onCalcular,
  fechaArranque,
  lugar,
  mesDescuento,
  anioDescuento,
  isAutoFilled,
  detectingLocation,
  onAsesorFieldChange,
}: PrestamoSectionProps) {
  const montoNum = Number(monto)
  const montoError =
    monto !== "" && (montoNum < 3000 || montoNum % 1000 !== 0)
      ? "Mínimo $3,000 y múltiplo de 1000"
      : undefined

  const today = new Date().toISOString().split("T")[0]

  const fechaArranqueDay = fechaArranque ? new Date(fechaArranque + "T12:00:00").getDate() : 0
  const fechaArranqueError =
    fechaArranque && fechaArranqueDay !== 15 && fechaArranqueDay !== 30
      ? "Solo se permiten los d\u00edas 15 y 30"
      : undefined
  const fechaArranqueValid = fechaArranque.length > 0 && (fechaArranqueDay === 15 || fechaArranqueDay === 30)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="monto" className="text-xs font-medium text-text-secondary">
            Monto neto (capital)
          </label>
          <Input
            id="monto"
            type="number"
            placeholder="Ej: $15000"
            value={monto}
            inputSize="sm"
            success={isComplete}
            error={montoError}
            step={montoNum === 0 ? 3000 : 1000}
            onChange={(e) => onMontoChange(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="plazo" className="text-xs font-medium text-text-secondary">
            Plazo (quincenas)
          </label>
          <div className="flex gap-2 flex-wrap">
            {PLAZOS_QNA.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onPlazoChange(q)}
                className={`
                  px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
                  ${
                    plazo === q
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
        disabled={!monto || montoNum < 3000 || montoNum % 1000 !== 0}
        leftIcon={<TrendingUp size={16} />}
      >
        Calcular
      </Button>

      {resultado && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Monto pagaré", value: `$${resultado.montoPagare.toLocaleString("es-MX")}` },
            { label: "Desc. quincenal", value: `$${resultado.descuentoQuincenal.toLocaleString("es-MX")}` },
            { label: "Tasa mensual", value: `${(resultado.tasaMensual * 100).toFixed(1)}%` },
            { label: "CAT anual", value: `${(resultado.cat * 100).toFixed(1)}%` },
          ].map((item) => (
            <div key={item.label} className="bg-bg border border-border rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-1">{item.label}</p>
              <p className="text-lg font-semibold text-primary">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="text-xs font-semibold text-text-secondary uppercase mb-3">
          Datos del Contrato
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Fecha Arranque <span className="text-error">*</span>
            </label>
            <DateInput
              id="fechaArranque"
              value={fechaArranque}
              minDate={today}
              inputSize="sm"
              success={fechaArranqueValid}
              error={fechaArranqueError}
              onChange={(v) => onAsesorFieldChange("fechaArranque", v)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Lugar <span className="text-error">*</span>
            </label>
            <NameInput
              id="lugar"
              placeholder="Ciudad, Estado"
              value={lugar}
              inputSize="sm"
              leftIcon={detectingLocation ? <Spinner size="sm" /> : <MapPin size={14} className="text-text-tertiary" />}
              success={(lugar?.trim()?.length ?? 0) > 0}
              onChange={(v) => onAsesorFieldChange("lugar", v)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Mes Descuento <span className="text-error">*</span>
            </label>
            <SelectField
              id="mesDescuento"
              value={mesDescuento}
              options={MESES}
              placeholder="Seleccionar mes"
              success={(mesDescuento?.length ?? 0) > 0}
              disabled={isAutoFilled}
              onChange={(v) => onAsesorFieldChange("mesDescuento", v)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-secondary">
              Año Descuento <span className="text-error">*</span>
            </label>
            <NumericInput
              id="anioDescuento"
              placeholder="0000"
              value={anioDescuento}
              maxLength={4}
              inputSize="sm"
              success={(anioDescuento?.length ?? 0) === 4}
              onChange={(v) => onAsesorFieldChange("anioDescuento", v)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export { PrestamoSection }
