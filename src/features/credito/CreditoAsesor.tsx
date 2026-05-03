/**
 * Archivo: features/credito/CreditoAsesor.tsx
 * Propósito: Paso 3 del flujo - Crédito y asesor.
 * Reorganiza la lógica de tabla crediticia y datos del asesor.
 */
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TrendingUp, FileDown } from "lucide-react"
import { Card, Button, FormFieldInput } from "@/components"
import { calcularTabla } from "@/services"
import { formatCurrency, formatPercentage } from "@/utils"
import { useContractStore } from "@/store/useContractStore"
import type { TablaCreditoData } from "@/types"

function CreditoAsesor() {
  const store = useContractStore()
  const [isCalculating, setIsCalculating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPlazo, setSelectedPlazo] = useState<number>(48)

  /** Obtiene el badge para una sección (simulado) */
  const getSectionBadge = (section: string) => {
    return <span className="text-xs">OK</span>
  }
  const [tablaResult, setTablaResult] = useState<TablaCreditoData | null>(
    store.formData.tabla
  )

  const creditoForm = useForm<{ montoNeto: number }>({
    defaultValues: { montoNeto: (store.formData.tabla as any)?.montoPagare || 0 },
  })

  const handleCalcular = async () => {
    const monto = creditoForm.getValues("montoNeto")
    if (!monto || monto <= 0) return

    setIsCalculating(true)
    try {
      const result = await calcularTabla({
        monto: monto,
        quincenas: selectedPlazo,
      })
      setTablaResult(result)
      store.setFormData("tabla", result)
    } catch (error) {
      console.error("Error calculando tabla:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      const newContract = {
        id: `CTR-${Date.now()}`,
        clientName: [store.formData.ine as any]?.nombre1 || "CLIENTE",
        date: new Date().toISOString().split("T")[0],
        monto: creditoForm.getValues("montoNeto") || 0,
        plazo: selectedPlazo,
        asesor: store.auth.user || "ASESOR",
        status: "completado" as const,
      }
      
      store.addContract(newContract)
      store.nextStep()
    } catch (error) {
      console.error("Error generando contrato:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const clientName = [
    (store.formData.ine as any)?.nombre1,
    (store.formData.ine as any)?.nombre2,
    (store.formData.ine as any)?.apellidoPaterno,
    (store.formData.ine as any)?.apellidoMaterno,
  ].filter(Boolean).join(" ").toUpperCase()

  return (
    <div className="space-y-4 pb-4">
      <Card title="Cálculo de Crédito">
        <div className="space-y-3">
          <FormFieldInput
            id="montoNeto"
            label="Monto Neto (Capital)"
            required
            inputProps={{
              ...creditoForm.register("montoNeto", { valueAsNumber: true }),
              type: "number",
              min: 1000,
              max: 200000,
              step: 500,
              prefix: "MXN $",
              className: "text-base font-semibold",
            } as any}
            error={creditoForm.formState.errors.montoNeto?.message}
          />

          <div>
            <label className="text-xs font-medium text-stone-500 mb-2 block">
              Plazo (Quincenas) <span className="text-error text-[10px]">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {[24, 36, 48, 72, 96, 120].map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`px-3 py-1 rounded-full border text-xs font-medium transition-all cursor-pointer ${
                    selectedPlazo === q
                      ? "bg-primary text-white border-primary"
                      : "bg-stone-50 text-stone-500 border-stone-200 hover:border-primary hover:text-primary"
                  }`}
                  onClick={() => setSelectedPlazo(q)}
                >
                  {q} QNAs
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            loading={isCalculating}
            disabled={!creditoForm.watch("montoNeto") || creditoForm.watch("montoNeto") <= 0}
            onClick={handleCalcular}
          >
            <TrendingUp size={16} />
            Calcular tabla
          </Button>

          {tablaResult && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                <div className="text-xs text-stone-500 mb-0.5">Monto Pagaré</div>
                <div className="text-base font-semibold text-primary">
                  {formatCurrency(tablaResult.montoPagare)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                <div className="text-xs text-stone-500 mb-0.5">Descuento Quincenal</div>
                <div className="text-base font-semibold text-primary">
                  {formatCurrency(tablaResult.descuentoQuincenal)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                <div className="text-xs text-stone-500 mb-0.5">Tasa Mensual</div>
                <div className="text-base font-semibold">
                  {formatPercentage(tablaResult.tasaMensual)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-md p-3">
                <div className="text-xs text-stone-500 mb-0.5">CAT Anual</div>
                <div className="text-base font-semibold">
                  {formatPercentage(tablaResult.cat)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Resumen del Contrato">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-stone-500">Cliente:</span>
            <span className="font-medium">{clientName || "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Monto:</span>
            <span className="font-medium text-primary">
              {formatCurrency(creditoForm.watch("montoNeto") || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Plazo:</span>
            <span className="font-medium">{selectedPlazo} QNAs</span>
          </div>
          {tablaResult && (
            <div className="flex justify-between">
              <span className="text-stone-500">Descuento:</span>
              <span className="font-medium text-primary">
                {formatCurrency(tablaResult.descuentoQuincenal)}
              </span>
            </div>
          )}
        </div>
      </Card>

      <Button
        variant="primary"
        size="lg"
        className="w-full bg-success hover:bg-success-hover"
        disabled={!tablaResult}
        loading={isGenerating}
        onClick={handleGenerate}
      >
        <FileDown size={16} />
        Generar Contrato PDF
      </Button>
    </div>
  )
}

export { CreditoAsesor }
