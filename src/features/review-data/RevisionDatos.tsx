/** Paso 2 del flujo — revisar y editar los datos extraídos por OCR.
 *
 *  Estructura en 4 secciones tipo accordion:
 *   - Datos Personales → nombre, apellidos, CURP, sexo, fecha nacimiento, clave elector
 *   - Domicilio        → calle, CP, colonia, no. exterior, municipio, estado
 *   - Datos Laborales  → RFC, no. empleado, dependencia, departamento, puesto, ingreso
 *   - Datos Bancarios  → no. cuenta, banco, CLABE
 *
 *  Lógica de validación y renderizado extraída a utils/ para mantener
 *  este componente enfocado en orquestación y layout. */
import { useState, useMemo } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";
import {
  sections,
  type SectionId,
} from "@/constants/revisionFields";
import {
  isSectionComplete,
  getFieldValueFromData,
  isFieldFilled,
  DOMICILIO_FIELDS,
} from "./utils/validation";
import { renderField } from "./utils/fieldRenderer";

function RevisionDatos() {
  const [expandedSection, setExpandedSection] = useState<SectionId | null>("personales");
  const formData = useContractStore((s) => s.formData);
  const setFormData = useContractStore((s) => s.setFormData);

  const completion: Record<SectionId, boolean> = useMemo(
    () => ({
      personales: isSectionComplete("personales", formData),
      domicilio: isSectionComplete("domicilio", formData),
      laborales: isSectionComplete("laborales", formData),
      bancarios: isSectionComplete("bancarios", formData),
    }),
    [formData],
  );

  const toggleSection = (id: SectionId) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const update = (section: "ine" | "nomina" | "banco", field: string, value: string) => {
    const isDomicilioField = DOMICILIO_FIELDS.includes(field);

    if (section === "ine" && isDomicilioField) {
      setFormData("ine", {
        ...formData.ine,
        domicilio: {
          ...(formData.ine.domicilio || {}),
          [field]: value,
        },
      });
    } else {
      setFormData(section, {
        ...formData[section],
        [field]: value,
      });
    }
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
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const isComplete = completion[section.id];
          const isCollapsedWithIssues = !isExpanded && !isComplete;

          const cardBorder = isComplete
            ? "border-success/30"
            : isCollapsedWithIssues
              ? "border-error/40"
              : "border-border";

          return (
            <Card
              key={section.id}
              className={`overflow-hidden border-2 transition-colors ${cardBorder}`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-bg transition-colors"
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
                aria-controls={`section-${section.id}`}
              >
                <div className="flex items-center gap-2.5">
                  <section.icon
                    size={20}
                    className="text-primary shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold text-text-primary">
                    {section.title}
                  </span>
                  {isComplete ? (
                    <CheckCircle2
                      size={16}
                      className="text-success shrink-0"
                      aria-label="Sección completa"
                    />
                  ) : isCollapsedWithIssues ? (
                    <AlertTriangle
                      size={16}
                      className="text-warning shrink-0"
                      aria-label="Faltan datos obligatorios"
                    />
                  ) : null}
                </div>
                <ChevronDown
                  size={18}
                  className={`text-text-secondary transition-transform shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div id={`section-${section.id}`} className="px-4 md:px-5 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const val = getFieldValueFromData(formData, section.section, field.id);
                      const isFilled = isFieldFilled(field.id, val);

                      return (
                        <div key={field.id} className="space-y-1.5">
                          <label
                            htmlFor={field.id}
                            className="text-xs font-medium text-text-secondary"
                          >
                            {field.label}
                            <span className="text-error ml-0.5" aria-hidden="true">*</span>
                          </label>
                          {renderField(field, val, isFilled, (value) =>
                            update(section.section, field.id, value),
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { RevisionDatos };
