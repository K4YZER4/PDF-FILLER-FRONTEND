import { useState } from "react"
import { TrendingUp, User, Phone, Calendar, Users } from "lucide-react"
import { Card } from "@/components"
import { useClientName } from "@/store/selectors"
import { useCreditoAsesor } from "./hooks/useCreditoAsesor"
import type { AsesorData } from "./types"
import {
  AccordionSection,
  PrestamoSection,
  AsesorSection,
  ContactoFields,
  AntiguedadSection,
  ReferenciasSection,
} from "./components"

const SECTIONS = [
  { id: "prestamo",   title: "Pr\u00e9stamo",               icon: TrendingUp },
  { id: "asesor",     title: "Datos del Asesor",        icon: User       },
  { id: "contacto",   title: "Contacto y Estado Civil", icon: Phone      },
  { id: "antiguedad", title: "Antig\u00fcedad",              icon: Calendar   },
  { id: "referencias",title: "Referencias",             icon: Users      },
] as const

function CreditoAsesor() {
  const [expandedSection, setExpandedSection] = useState<string | null>("prestamo")
  const hook = useCreditoAsesor()
  const clientName = useClientName()

  const toggle = (id: string) =>
    setExpandedSection((prev) => (prev === id ? null : id))

  const isAutoFilled = hook.userRole !== "admin" || hook.asesorData.asesor.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Datos del Pr\u00e9stamo</h2>
        <p className="text-sm text-text-secondary">Configura los t\u00e9rminos del cr\u00e9dito</p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <AccordionSection
            key={section.id}
            id={section.id}
            title={section.title}
            icon={section.icon}
            isComplete={hook.completion[section.id as keyof typeof hook.completion]}
            isExpanded={expandedSection === section.id}
            onToggle={() => toggle(section.id)}
          >
            {section.id === "prestamo" && (
              <PrestamoSection
                monto={hook.monto}
                plazo={hook.plazo}
                isCalculando={hook.isCalculando}
                resultado={hook.resultado}
                isComplete={hook.completion.prestamo}
                onMontoChange={(v) => { hook.setMonto(v); hook.resetResultado() }}
                onPlazoChange={hook.setPlazo}
                onCalcular={hook.calcular}
                fechaArranque={hook.asesorData.fechaArranque}
                lugar={hook.asesorData.lugar}
                mesDescuento={hook.asesorData.mesDescuento}
                anioDescuento={hook.asesorData.anioDescuento}
                isAutoFilled={isAutoFilled}
                detectingLocation={hook.detectingLocation}
                onAsesorFieldChange={(field, value) =>
                  hook.updateAsesor(field as keyof AsesorData, value)
                }
              />
            )}
            {section.id === "asesor" && (
              <AsesorSection
                data={hook.asesorData}
                userRole={hook.userRole}
                onChange={hook.updateAsesor}
              />
            )}
            {section.id === "contacto" && <ContactoFields />}
            {section.id === "antiguedad" && <AntiguedadSection />}
            {section.id === "referencias" && <ReferenciasSection />}
          </AccordionSection>
        ))}
      </div>

      <Card className="p-5 md:p-6 space-y-3 border-2 border-border">
        <h3 className="text-sm font-semibold text-text-primary">Resumen</h3>
        {[
          { label: "Cliente", value: clientName },
          { label: "Monto",   value: `$${Number(hook.monto || 0).toLocaleString("es-MX")}` },
          { label: "Plazo",   value: `${hook.plazo} QNAs` },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary">{item.value}</span>
          </div>
        ))}
      </Card>
    </div>
  )
}

export { CreditoAsesor }
