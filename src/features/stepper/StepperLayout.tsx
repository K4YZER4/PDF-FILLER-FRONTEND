/**
 * Archivo: features/stepper/StepperLayout.tsx
 * Propósito: Layout profesional con barra de progreso de 4 pasos.
 */
import { useContractStore } from "@/store/useContractStore"
import { SubirDocs } from "@/features/documentos"
import { RevisionDatos } from "@/features/revision"
import { CreditoAsesor } from "@/features/credito/CreditoAsesor"
import { VistaPrevia } from "@/features/vistaprevia"
import { FileText, Search, Calculator, Eye, CheckCircle } from "lucide-react"
import { Button } from "@/components"

const STEPS = [
  { id: 1, name: "Documentos", icon: FileText },
  { id: 2, name: "Datos", icon: Search },
  { id: 3, name: "Crédito", icon: Calculator },
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center shadow-md">
                <FileText size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-stone-900">Nuevo Contrato</h1>
                <p className="text-xs text-stone-500">Paso {currentStep} de 4</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id
              const isCurrent = currentStep === step.id
              const isUpcoming = currentStep < step.id

              return (
                <button
                  key={step.id}
                  onClick={() => { if (isCompleted || isCurrent) setStep(step.id as any) }}
                  className={`flex-1 flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:p-3 rounded-lg transition-all ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                      ? "bg-success/10 text-success hover:bg-success/20"
                      : "bg-stone-100 text-stone-400 cursor-not-allowed"
                  }`}
                  disabled={isUpcoming}
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-primary text-white"
                      : isCompleted
                      ? "bg-success text-white"
                      : "bg-stone-200 text-stone-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={14} className="md:w-4 md:h-4" />
                    ) : (
                      <step.icon size={14} className="md:w-4 md:h-4" />
                    )}
                  </div>
                  <span className="text-[10px] md:text-xs font-medium">{step.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </header>

      <main className="flex-1 py-6 md:py-10">
        {currentStep === 1 && <SubirDocs />}
        {currentStep === 2 && <RevisionDatos />}
        {currentStep === 3 && <CreditoAsesor />}
        {currentStep === 4 && <VistaPrevia />}
      </main>

      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-stone-200/50">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex gap-3 md:gap-4">
          <Button
            variant="secondary"
            onClick={handlePrev}
            className="flex-1 md:flex-none md:min-w-[120px]"
          >
            {currentStep === 1 ? "Cancelar" : "Volver"}
          </Button>
          {currentStep < 4 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={!canContinue()}
              className="flex-1 md:flex-none md:min-w-[120px]"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              className="flex-1 md:flex-none md:min-w-[120px] bg-success hover:bg-success-hover"
            >
              Generar
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

export { StepperLayout }
