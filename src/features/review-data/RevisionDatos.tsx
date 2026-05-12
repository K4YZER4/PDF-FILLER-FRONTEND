/** Paso 2 del flujo: Revisar y editar datos extraídos.
 *  Organizado en 4 secciones tipo accordion (una abierta a la vez):
 *  - Datos Personales → 8 campos (nombre, apellidos, CURP, etc.)
 *  - Domicilio → 6 campos (calle, CP, colonia, etc.) almacenados en ine.domicilio
 *  - Datos Laborales → 6 campos (RFC, empleado, puesto, etc.)
 *  - Datos Bancarios → 3 campos (cuenta, banco, CLABE)
 *  Los campos de domicilio se guardan dentro de ine.domicilio, el resto directamente en su sección. */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { Input } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

import { sections } from "@/constants/revisionFields";

type SectionId = "personales" | "domicilio" | "laborales" | "bancarios";

function RevisionDatos() {
  const [expandedSection, setExpandedSection] =
    useState<SectionId>("personales");
  const formData = useContractStore((s) => s.formData);
  const setFormData = useContractStore((s) => s.setFormData);

  const domicilioFields = [
    "calle",
    "codigoPostal",
    "colonia",
    "noExt",
    "municipio",
    "estado",
  ];

  const update = (
    section: "ine" | "nomina" | "banco",
    field: string,
    value: string,
  ) => {
    if (section === "ine" && domicilioFields.includes(field)) {
      setFormData("ine", {
        ...(formData.ine as any),
        domicilio: { ...(formData.ine as any)?.domicilio, [field]: value },
      });
    } else {
      setFormData(section, { ...(formData[section] as any), [field]: value });
    }
  };

  const getFieldValue = (
    section: "ine" | "nomina" | "banco",
    fieldId: string,
  ): string => {
    const data = formData[section] as any;
    if (!data) return "";
    if (section === "ine" && domicilioFields.includes(fieldId))
      return data.domicilio?.[fieldId] || "";
    return data[fieldId] || "";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Revisar Datos
        </h2>
        <p className="text-sm text-text-secondary">
          Verifica que la información sea correcta
        </p>
      </div>
      <div className="space-y-3">
        {sections.map((section) => (
          <Card key={section.id} className="overflow-hidden">
            <button
              className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-bg transition-colors"
              onClick={() => setExpandedSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <section.icon size={20} className="text-primary" />
                <span className="text-sm font-semibold text-text-primary">
                  {section.title}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={`text-text-secondary transition-transform ${expandedSection === section.id ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSection === section.id && (
              <div className="px-4 md:px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <label
                        htmlFor={field.id}
                        className="text-xs font-medium text-text-secondary"
                      >
                        {field.label}
                      </label>
                      <Input
                        id={field.id}
                        inputSize="sm"
                        placeholder={field.placeholder}
                        value={getFieldValue(section.section, field.id)}
                        onChange={(e) =>
                          update(section.section, field.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export { RevisionDatos };
