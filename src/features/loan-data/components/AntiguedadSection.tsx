/**
 * Sección "Antigüedad" del accordion.
 *
 * Renderiza Fecha de Ingreso (date picker) más los campos Meses y Años
 * que se calculan automáticamente al seleccionar la fecha.
 *
 * Flujo de datos:
 *   - Lectura: store.formData.antiguedadData (Zustand selector)
 *   - Escritura: setFormData("antiguedadData", {...}) en un solo batch desde
 *     handleFechaIngresoChange, evitando stale closures porque no depende
 *     del estado renderizado anterior.
 *
 * Campos calculados (readOnly con bg-bg cursor-default):
 *   - meses: total de meses transcurridos desde fechaIngreso hasta hoy
 *   - anos:  floor(totalMeses / 12)
 *
 * Uso:
 *   <AntiguedadSection />
 */

import { useCallback } from "react"
import { NumericInput, DateInput } from "@/components/ui"
import { useContractStore } from "@/store/useContractStore"

function calcularAntiguedad(fechaIngreso: string): {
  meses: string
  anos: string
} {
  if (!fechaIngreso) return { meses: "", anos: "" }
  const ingreso = new Date(fechaIngreso)
  const hoy = new Date()
  let totalMeses =
    (hoy.getFullYear() - ingreso.getFullYear()) * 12 +
    hoy.getMonth() -
    ingreso.getMonth()
  if (hoy.getDate() < ingreso.getDate()) totalMeses--
  if (totalMeses < 0) totalMeses = 0
  return {
    meses: String(totalMeses),
    anos: String(Math.floor(totalMeses / 12)),
  }
}

function AntiguedadSection() {
  const setFormData = useContractStore((s) => s.setFormData)
  const antiguedadData = useContractStore((s) => s.formData.antiguedadData)

  const handleFechaIngresoChange = useCallback(
    (v: string) => {
      if (!v) {
        setFormData("antiguedadData", { fechaIngreso: "", meses: "", anos: "" })
        return
      }
      const { meses, anos } = calcularAntiguedad(v)
      setFormData("antiguedadData", { fechaIngreso: v, meses, anos })
    },
    [setFormData],
  )

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha de Ingreso <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaIngreso"
          value={antiguedadData.fechaIngreso}
          maxDate={today}
          success={(antiguedadData.fechaIngreso?.length ?? 0) > 0}
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
          value={antiguedadData.meses}
          maxLength={3}
          readOnly
          className="bg-bg cursor-default"
          success={(antiguedadData.meses?.length ?? 0) > 0}
          onChange={() => {}}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Años <span className="text-error">*</span>
        </label>
        <NumericInput
          id="anos"
          placeholder="0"
          value={antiguedadData.anos}
          maxLength={3}
          readOnly
          className="bg-bg cursor-default"
          success={(antiguedadData.anos?.length ?? 0) > 0}
          onChange={() => {}}
        />
      </div>
    </div>
  )
}

export { AntiguedadSection }
