/**
 * Archivo: features/revision/RevisionDatos.tsx
 * Propósito: Paso 2 - Revisar y editar datos con diseño profesional.
 */
import { useState } from "react"
import { ChevronDown, User, Home, Briefcase, Building } from "lucide-react"
import { Card, FormField } from "@/components"
import { useContractStore } from "@/store/useContractStore"

type SectionId = "personales" | "domicilio" | "laborales" | "bancarios"

function RevisionDatos() {
  const [expandedSection, setExpandedSection] = useState<SectionId>("personales")
  const formData = useContractStore((s) => s.formData)
  const setFormData = useContractStore((s) => s.setFormData)

  const toggleSection = (section: SectionId) => {
    setExpandedSection(expandedSection === section ? section : section)
  }

  const updateField = (section: SectionId, fieldId: string, value: string) => {
    if (section === "personales") {
      setFormData("ine", { ...(formData.ine as any), [fieldId]: value })
    } else if (section === "domicilio") {
      setFormData("ine", {
        ...(formData.ine as any),
        domicilio: { ...(formData.ine as any)?.domicilio, [fieldId]: value },
      })
    } else if (section === "laborales") {
      setFormData("nomina", { ...(formData.nomina as any), [fieldId]: value })
    } else if (section === "bancarios") {
      setFormData("banco", { ...(formData.banco as any), [fieldId]: value })
    }
  }

  const sections = [
    {
      id: "personales" as const,
      title: "Datos Personales",
      icon: User,
      fields: [
        { id: "primerNombre", label: "Primer nombre", value: (formData.ine as any)?.primerNombre || "", type: "text" },
        { id: "segundoNombre", label: "Segundo nombre", value: (formData.ine as any)?.segundoNombre || "", type: "text" },
        { id: "primerApellido", label: "Primer apellido", value: (formData.ine as any)?.primerApellido || "", type: "text" },
        { id: "segundoApellido", label: "Segundo apellido", value: (formData.ine as any)?.segundoApellido || "", type: "text" },
        { id: "curp", label: "CURP", value: (formData.ine as any)?.curp || "", type: "text" },
        { id: "sexo", label: "Sexo", value: (formData.ine as any)?.sexo || "", type: "text" },
        { id: "fechaNacimiento", label: "Fecha de nacimiento", value: (formData.ine as any)?.fechaNacimiento || "", type: "date" },
        { id: "claveElector", label: "Clave de elector", value: (formData.ine as any)?.claveElector || "", type: "text" },
      ],
    },
    {
      id: "domicilio" as const,
      title: "Domicilio",
      icon: Home,
      fields: [
        { id: "calle", label: "Calle", value: (formData.ine as any)?.domicilio?.calle || "", type: "text" },
        { id: "codigoPostal", label: "Código postal", value: (formData.ine as any)?.domicilio?.codigoPostal || "", type: "text" },
        { id: "colonia", label: "Colonia", value: (formData.ine as any)?.domicilio?.colonia || "", type: "text" },
        { id: "noExt", label: "No. ext", value: (formData.ine as any)?.domicilio?.noExt || "", type: "text" },
        { id: "municipio", label: "Municipio", value: (formData.ine as any)?.domicilio?.municipio || "", type: "text" },
        { id: "estado", label: "Estado", value: (formData.ine as any)?.domicilio?.estado || "", type: "text" },
      ],
    },
    {
      id: "laborales" as const,
      title: "Datos Laborales",
      icon: Briefcase,
      fields: [
        { id: "rfc", label: "RFC", value: (formData.nomina as any)?.rfc || "", type: "text" },
        { id: "noEmpleado", label: "No. empleado", value: (formData.nomina as any)?.noEmpleado || "", type: "text" },
        { id: "dependencia", label: "Dependencia", value: (formData.nomina as any)?.dependencia || "", type: "text" },
        { id: "departamento", label: "Departamento", value: (formData.nomina as any)?.departamento || "", type: "text" },
        { id: "puesto", label: "Puesto", value: (formData.nomina as any)?.puesto || "", type: "text" },
        { id: "ingresoMensual", label: "Ingreso mensual", value: (formData.nomina as any)?.ingresoMensual || "", type: "number" },
      ],
    },
    {
      id: "bancarios" as const,
      title: "Datos Bancarios",
      icon: Building,
      fields: [
        { id: "noCuenta", label: "No. de cuenta", value: (formData.banco as any)?.noCuenta || "", type: "text" },
        { id: "banco", label: "Banco", value: (formData.banco as any)?.banco || "", type: "text" },
        { id: "clabe", label: "CLABE interbancaria", value: (formData.banco as any)?.clabe || "", type: "text" },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-stone-900 mb-2">Revisar Datos</h2>
        <p className="text-sm text-stone-500">Verifica que toda la información sea correcta</p>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-stone-50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon size={20} className="text-primary" />
                <span className="text-sm font-semibold text-stone-800">{section.title}</span>
              </div>
              <ChevronDown
                size={18}
                className={`text-stone-400 transition-transform ${expandedSection === section.id ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSection === section.id && (
              <div className="px-4 md:px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <FormField
                      key={field.id}
                      id={field.id}
                      label={field.label}
                      value={field.value}
                      type={field.type}
                      onChange={(e) => updateField(section.id, field.id, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export { RevisionDatos }
