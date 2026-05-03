/**
 * Archivo: features/stepper/StepperLayout.tsx
 * Propósito: Layout con barra de progreso de 4 pasos.
 */
import { useContractStore } from "@/store/useContractStore"
import { SubirDocs } from "@/features/documentos"
import { RevisionDatos } from "@/features/revision"
import { CreditoAsesor } from "@/features/credito/CreditoAsesor"
import { VistaPrevia } from "@/features/vistaprevia"
import { FileText, Search, Calculator, Eye } from "lucide-react"
import { Button } from "@/components"

const STEPS = [
  { id: 1, name: "Subir documentos", icon: FileText },
  { id: 2, name: "Revisar datos", icon: Search },
  { id: 3, name: "Crédito y asesor", icon: Calculator },
  { id: 4, name: "Vista previa", icon: Eye },
] as const

function StepperLayout() {
  const currentStep = useContractStore((state) => state.step.current)
  const setStep = useContractStore((state) => state.setStep)
  const nextStep = useContractStore((state) => state.nextStep)
  const prevStep = useContractStore((state) => state.prevStep)
  const documents = useContractStore((state) => state.documents)
  const tablaData = useContractStore((state) => state.formData.tabla)

  const canContinue = () => {
    if (currentStep === 1) return documents.scanStatus === "done"
    if (currentStep === 2) return true
    if (currentStep === 3) return tablaData !== null
    return false
  }

  const handleNext = () => { if (canContinue()) nextStep() }

  const handlePrev = () => {
    if (currentStep === 1) { window.location.href = "/" } else { prevStep() }
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <FileText size={18} className="text-white" />
          </div>
          <span className="text-sm font-semibold">Nuevo Contrato</span>
        </div>
        <div className="flex gap-1">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id
            const isCurrent = currentStep === step.id
            return (
              <button
                key={step.id}
                onClick={() => { if (isCompleted || isCurrent) setStep(step.id as any) }}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  isCompleted ? "bg-success" : isCurrent ? "bg-primary" : "bg-stone-200"
                }`}
                aria-label={`Paso ${step.id}`}
              />
            )
          })}
        </div>
        <p className="text-xs text-stone-500">
          Paso {currentStep} de 4 — {STEPS[currentStep - 1].name}
        </p>
      </header>

      <main className="flex-1 px-4 py-4 overflow-y-auto">
        {currentStep === 1 && <SubirDocs />}
        {currentStep === 2 && <RevisionDatos />}
        {currentStep === 3 && <CreditoAsesor />}
        {currentStep === 4 && <VistaPrevia />}
      </main>

      <footer className="sticky bottom-0 bg-white border-t border-stone-200 px-4 py-3 flex gap-3 safe-area-inset-bottom">
        <Button variant="secondary" onClick={handlePrev} className="flex-1">
          {currentStep === 1 ? "Cancelar" : "Volver"}
        </Button>
        {currentStep < 4 ? (
          <Button variant="primary" onClick={handleNext} disabled={!canContinue()} className="flex-1">
            Siguiente
          </Button>
        ) : (
          <Button variant="primary" className="flex-1 bg-success hover:bg-success-hover">
            Generar
          </Button>
        )}
      </footer>
    </div>
  )
}

export { StepperLayout }
