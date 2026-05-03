/**
 * Archivo: features/revision/RevisionDatos.tsx
 * Propósito: Paso 2 del flujo - Revisar y editar datos.
 */
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Card, FormFieldInput } from "@/components"
import { useContractStore } from "@/store/useContractStore"

type SectionId = "personales" | "domicilio" | "laborales" | "bancarios"

function RevisionDatos() {
  const [expandedSection, setExpandedSection] = useState<SectionId>("personales")
  const formData = useContractStore((s) => s.formData)
  const setFormData = useContractStore((s) => s.setFormData)

  const toggleSection = (section: SectionId) => {
    setExpandedSection(expandedSection === section ? section : section)
  }

  return (
    <div className="space-y-3">
      {/* Datos Personales */}
      <Card className="overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection("personales")}
        >
          <span className="text-sm font-semibold">Datos personales</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSection === "personales" ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSection === "personales" && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <FormFieldInput
              id="primerNombre"
              label="Primer nombre"
              inputProps={{
                value: (formData.ine as any)?.primerNombre || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), primerNombre: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="segundoNombre"
              label="Segundo nombre"
              inputProps={{
                value: (formData.ine as any)?.segundoNombre || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), segundoNombre: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="primerApellido"
              label="Primer apellido"
              inputProps={{
                value: (formData.ine as any)?.primerApellido || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), primerApellido: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="segundoApellido"
              label="Segundo apellido"
              inputProps={{
                value: (formData.ine as any)?.segundoApellido || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), segundoApellido: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="curp"
              label="CURP"
              inputProps={{
                value: (formData.ine as any)?.curp || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), curp: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="sexo"
              label="Sexo"
              inputProps={{
                value: (formData.ine as any)?.sexo || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), sexo: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="fechaNacimiento"
              label="Fecha de nacimiento"
              inputProps={{
                value: (formData.ine as any)?.fechaNacimiento || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), fechaNacimiento: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="claveElector"
              label="Clave de elector"
              inputProps={{
                value: (formData.ine as any)?.claveElector || "",
                onChange: (e) => setFormData({ ine: { ...(formData.ine as any), claveElector: e.target.value } }),
              }}
            />
          </div>
        )}
      </Card>

      {/* Domicilio */}
      <Card className="overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection("domicilio")}
        >
          <span className="text-sm font-semibold">Domicilio</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSection === "domicilio" ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSection === "domicilio" && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <FormFieldInput
              id="calle"
              label="Calle"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.calle || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, calle: e.target.value },
                  },
                }),
              }}
            />
            <FormFieldInput
              id="codigoPostal"
              label="Código postal"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.codigoPostal || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, codigoPostal: e.target.value },
                  },
                }),
              }}
            />
            <FormFieldInput
              id="colonia"
              label="Colonia"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.colonia || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, colonia: e.target.value },
                  },
                }),
              }}
            />
            <FormFieldInput
              id="noExt"
              label="No. ext"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.noExt || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, noExt: e.target.value },
                  },
                }),
              }}
            />
            <FormFieldInput
              id="municipio"
              label="Municipio"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.municipio || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, municipio: e.target.value },
                  },
                }),
              }}
            />
            <FormFieldInput
              id="estado"
              label="Estado"
              inputProps={{
                value: (formData.ine as any)?.domicilio?.estado || "",
                onChange: (e) => setFormData({
                  ine: {
                    ...(formData.ine as any),
                    domicilio: { ...(formData.ine as any)?.domicilio, estado: e.target.value },
                  },
                }),
              }}
            />
          </div>
        )}
      </Card>

      {/* Datos Laborales */}
      <Card className="overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection("laborales")}
        >
          <span className="text-sm font-semibold">Datos laborales</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSection === "laborales" ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSection === "laborales" && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <FormFieldInput
              id="rfc"
              label="RFC"
              inputProps={{
                value: (formData.nomina as any)?.rfc || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), rfc: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="noEmpleado"
              label="No. empleado"
              inputProps={{
                value: (formData.nomina as any)?.noEmpleado || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), noEmpleado: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="dependencia"
              label="Dependencia"
              inputProps={{
                value: (formData.nomina as any)?.dependencia || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), dependencia: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="departamento"
              label="Departamento"
              inputProps={{
                value: (formData.nomina as any)?.departamento || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), departamento: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="puesto"
              label="Puesto"
              inputProps={{
                value: (formData.nomina as any)?.puesto || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), puesto: e.target.value } }),
              }}
            />
            <FormFieldInput
              id="ingresoMensual"
              label="Ingreso mensual"
              inputProps={{
                value: (formData.nomina as any)?.ingresoMensual || "",
                onChange: (e) => setFormData({ nomina: { ...(formData.nomina as any), ingresoMensual: e.target.value } }),
              }}
            />
          </div>
        )}
      </Card>

      {/* Datos Bancarios */}
      <Card className="overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-4 text-left"
          onClick={() => toggleSection("bancarios")}
        >
          <span className="text-sm font-semibold">Datos bancarios</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${expandedSection === "bancarios" ? "rotate-180" : ""}`}
          />
        </button>
        {expandedSection === "bancarios" && (
          <div className="px-4 pb-4 grid grid-cols-2 gap-3">
            <FormFieldInput
              id="noCuenta"
              label="No. de cuenta"
              inputProps={{
                value: (formData.estadoCuenta as any)?.noCuenta || "",
                onChange: (e) => setFormData({
                  estadoCuenta: { ...(formData.estadoCuenta as any), noCuenta: e.target.value },
                }),
              }}
            />
            <FormFieldInput
              id="banco"
              label="Banco"
              inputProps={{
                value: (formData.estadoCuenta as any)?.banco || "",
                onChange: (e) => setFormData({
                  estadoCuenta: { ...(formData.estadoCuenta as any), banco: e.target.value },
                }),
              }}
            />
            <FormFieldInput
              id="clabe"
              label="CLABE interbancaria"
              inputProps={{
                value: (formData.estadoCuenta as any)?.clabe || "",
                onChange: (e) => setFormData({
                  estadoCuenta: { ...(formData.estadoCuenta as any), clabe: e.target.value },
                }),
              }}
            />
          </div>
        )}
      </Card>
    </div>
  )
}

export { RevisionDatos }
