/**
 * Archivo: features/credito/CreditoAsesor.tsx
 * Propósito: Paso 3 - Crédito y asesor con diseño profesional.
 */
import { useState } from "react"
import { useForm } from "react-hook-form"
import { TrendingUp, FileDown } from "lucide-react"
import { Card, Button, FormField } from "@/components"
import { calcularTabla } from "@/services"
import { formatCurrency, formatPercentage } from "@/utils"
import { useContractStore } from "@/store/useContractStore"
import type { TablaCreditoData } from "@/types"

const PLAZOS = [24, 36, 48, 72, 96, 120] as const
type Plazo = (typeof PLAZOS)[number]

function CreditoAsesor() {
  const store = useContractStore()
  const [isCalculating, setIsCalculating] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedPlazo, setSelectedPlazo] = useState<Plazo>(48)
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
        clientName: [
          (store.formData.ine as any)?.primerNombre,
          (store.formData.ine as any)?.segundoNombre,
          (store.formData.ine as any)?.primerApellido,
          (store.formData.ine as any)?.segundoApellido,
        ].filter(Boolean).join(" ").toUpperCase() || "CLIENTE",
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
    (store.formData.ine as any)?.primerNombre,
    (store.formData.ine as any)?.segundoNombre,
    (store.formData.ine as any)?.primerApellido,
    (store.formData.ine as any)?.segundoApellido,
  ].filter(Boolean).join(" ").toUpperCase()

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Crédito y Asesor</h2>
        <p className="text-sm text-stone-500">Configura los términos del crédito</p>
      </div>

      <Card className="p-5 md:p-6">
        <div className="space-y-5">
          <FormField
            id="montoNeto"
            label="Monto Neto (Capital)"
            value={creditoForm.watch("montoNeto")?.toString() || ""}
            onChange={(e) => creditoForm.setValue("montoNeto", parseFloat(e.target.value) || 0)}
            type="number"
          />

          <div>
            <label className="text-xs font-medium text-stone-600 mb-2 block">
              Plazo (Quincenas)
            </label>
            <div className="flex gap-2 flex-wrap">
              {PLAZOS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selectedPlazo === q
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-stone-600 border-stone-200 hover:border-primary"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <div className="text-xs text-stone-500 mb-1">Monto Pagaré</div>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(tablaResult.montoPagare)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <div className="text-xs text-stone-500 mb-1">Descuento Quincenal</div>
                <div className="text-lg font-semibold text-primary">
                  {formatCurrency(tablaResult.descuentoQuincenal)}
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <div className="text-xs text-stone-500 mb-1">Tasa Mensual</div>
                <div className="text-lg font-semibold">{formatPercentage(tablaResult.tasaMensual)}</div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <div className="text-xs text-stone-500 mb-1">CAT Anual</div>
                <div className="text-lg font-semibold">{formatPercentage(tablaResult.cat)}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h3 className="text-sm font-semibold text-stone-800 mb-4">Resumen del Contrato</h3>
        <div className="space-y-3 text-sm">
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
