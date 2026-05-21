/**
 * Paso 3 del flujo: Datos del Préstamo.
 *
 * Orquestador que renderiza 5 secciones dentro de un accordion:
 *   1. Préstamo     → PrestamoSection (monto, plazo, cálculo)
 *   2. Asesor       → AsesorSection (datos del asesor con auto-fill)
 *   3. Contacto     → ContactoFields (config-driven, lee/escribe Zustand directo)
 *   4. Antigüedad   → AntiguedadSection (cálculo automático meses/años)
 *   5. Referencias  → ReferenciasSection (3 bloques idénticos con nombre/tel)
 *
 * Cada sección se renderiza condicionalmente según section.id dentro de un
 * AccordionSection que maneja expandir/colapsar.
 *
 * Datos que fluyen a través del hook useCreditoAsesor:
 *   - Préstamo y Asesor: estado local en el hook, sincronizado al store
 *   - Contacto/Antigüedad/Referencias: leen/escriben Zustand directamente
 *   - completion: el hook lee todas las secciones del store para calcular
 *     los indicadores de completitud en los encabezados del accordion
 */

import { useState } from "react"
import { TrendingUp, User, Phone, Calendar, Users } from "lucide-react"
import { Card } from "@/components"
import { useClientName } from "@/store/selectors"
import { useCreditoAsesor } from "./hooks/useCreditoAsesor"
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

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Datos del Préstamo</h2>
        <p className="text-sm text-text-secondary">Configura los términos del crédito</p>
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
