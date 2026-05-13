/** Paso 2 del flujo: Revisar y editar datos extraídos.
 *  Organizado en 4 secciones tipo accordion (solo una abierta a la vez,
 *  todas se pueden cerrar):
 *  - Datos Personales → 8 campos (nombre, apellidos, CURP, etc.)
 *  - Domicilio → 6 campos (calle, CP, colonia, etc.) almacenados en ine.domicilio
 *  - Datos Laborales → 6 campos (RFC, empleado, puesto, etc.)
 *  - Datos Bancarios → 3 campos (cuenta, banco, CLABE)
 *  Los campos de domicilio se guardan dentro de ine.domicilio, el resto directamente en su sección.
 *
 *  Visual:
 *  - Asterisco rojo (*) en campos obligatorios
 *  - Check verde en secciones completas
 *  - Alerta naranja en secciones colapsadas con datos incompletos */
import { useState, useMemo } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";
import { sections, type SectionId } from "@/constants/revisionFields";

function isSectionComplete(id: SectionId, formData: any): boolean {
  const raw = (field: string, sec: string) => {
    const data = formData[sec] as any;
    if (!data) return "";
    if (sec === "ine" && ["calle","codigoPostal","colonia","noExt","municipio","estado"].includes(field))
      return data.domicilio?.[field] || "";
    return data[field] ?? "";
  };

  const section = sections.find((s) => s.id === id);
  if (!section) return false;

  return section.fields.every((f) => {
    const val = raw(f.id, section.section);
    if (f.id === "ingresoMensual") return Number(val) > 0;
    return String(val).trim().length > 0;
  });
}

function RevisionDatos() {
  const [expandedSection, setExpandedSection] = useState<SectionId | null>("personales");
  const formData = useContractStore((s) => s.formData);
  const setFormData = useContractStore((s) => s.setFormData);

  const completion = useMemo(
    () => ({
      personales: isSectionComplete("personales", formData),
      domicilio: isSectionComplete("domicilio", formData),
      laborales: isSectionComplete("laborales", formData),
      bancarios: isSectionComplete("bancarios", formData),
    }),
    [formData],
  );

  const domicilioFields = [
    "calle", "codigoPostal", "colonia", "noExt", "municipio", "estado",
  ];

  const toggleSection = (id: SectionId) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const update = (section: "ine" | "nomina" | "banco", field: string, value: string) => {
    if (section === "ine" && domicilioFields.includes(field)) {
      setFormData("ine", {
        ...(formData.ine as any),
        domicilio: { ...(formData.ine as any)?.domicilio, [field]: value },
      });
    } else {
      setFormData(section, { ...(formData[section] as any), [field]: value });
    }
  };

  const getFieldValue = (section: "ine" | "nomina" | "banco", fieldId: string): string => {
    const data = formData[section] as any;
    if (!data) return "";
    if (section === "ine" && domicilioFields.includes(fieldId))
      return data.domicilio?.[fieldId] || "";
    return data[fieldId] ?? "";
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

          let cardBorder = "border-border";
          if (isComplete) cardBorder = "border-success/30";
          else if (!isExpanded && !isComplete) cardBorder = "border-error/40";

          return (
          <Card key={section.id} className={`overflow-hidden border-2 transition-colors ${cardBorder}`}>
            <button
              className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-bg transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-2.5">
                <section.icon size={20} className="text-primary shrink-0" />
                <span className="text-sm font-semibold text-text-primary">
                  {section.title}
                </span>
                {isComplete ? (
                  <CheckCircle2 size={16} className="text-success shrink-0" aria-label="Completo" />
                ) : isCollapsedWithIssues ? (
                  <AlertTriangle size={16} className="text-warning shrink-0" aria-label="Faltan datos" />
                ) : null}
              </div>
              <ChevronDown
                size={18}
                className={`text-text-secondary transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
              />
            </button>
            {isExpanded && (
              <div className="px-4 md:px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => {
                    const val = getFieldValue(section.section, field.id);
                    const isFilled = field.id === "ingresoMensual"
                      ? Number(val) > 0
                      : String(val).trim().length > 0;

                    return (
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
                        required
                        success={isFilled}
                        error={!isFilled ? "Obligatorio" : undefined}
                        placeholder={field.placeholder}
                        value={val}
                        onChange={(e) =>
                          update(section.section, field.id, e.target.value)
                        }
                      />
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
