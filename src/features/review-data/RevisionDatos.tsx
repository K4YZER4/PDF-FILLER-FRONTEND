/**
 * Archivo: features/review-data/RevisionDatos.tsx
 * Propósito: Paso 2 del flujo — revisar y editar los datos extraídos por OCR.
 *
 * Estructura en 4 secciones tipo accordion:
 *   - Datos Personales → nombre, apellidos, CURP, sexo, fecha nacimiento, clave elector
 *   - Domicilio        → calle, CP, colonia, no. exterior, municipio, estado
 *   - Datos Laborales  → RFC, no. empleado, dependencia, departamento, puesto, ingreso
 *   - Datos Bancarios  → no. cuenta, banco, CLABE
 *
 * Reglas de almacenamiento:
 *   - Domicilio se guarda en ine.domicilio (objeto anidado)
 *   - El resto se guarda directamente en su sección (ine, nomina, banco)
 *
 * Visual:
 *   - Borde verde  → sección completa
 *   - Borde rojo   → sección colapsada con campos vacíos
 *   - Check verde  → todos los campos de la sección están llenos
 *   - Alerta naranja → sección colapsada con campos pendientes
 */
import { useState, useMemo } from "react";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";
import {
  sections,
  type SectionId,
  type FieldDef,
} from "@/constants/revisionFields";
import {
  NameInput,
  CURPInput,
  SexSelect,
  DateInput,
  NumericInput,
  CLABEInput,
  RFCInput,
} from "@/features/review-data/components";

// ─── Constantes ───────────────────────────────────────────────────────────────

/**
 * Campos que se almacenan dentro de ine.domicilio en lugar de ine directamente.
 * Definido fuera del componente para no recrear el array en cada render.
 */
const DOMICILIO_FIELDS = [
  "calle",
  "codigoPostal",
  "colonia",
  "noExt",
  "municipio",
  "estado",
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Verifica si todos los campos de una sección están completos.
 * Se usa para calcular el estado visual del accordion (borde verde/rojo)
 * y para determinar si el asesor puede avanzar al siguiente paso.
 *
 * Reglas especiales:
 *   - ingresoMensual debe ser un número mayor a 0
 *   - El resto de campos deben tener al menos un carácter no vacío
 */
function isSectionComplete(id: SectionId, formData: any): boolean {
  const section = sections.find((s) => s.id === id);
  if (!section) return false;

  return section.fields.every((f) => {
    const val = getFieldValueFromData(formData, section.section, f.id);
    if (f.id === "ingresoMensual") return Number(val) > 0;
    return String(val).trim().length > 0;
  });
}

/**
 * Lee el valor de un campo del formData.
 * Los campos de domicilio se leen desde ine.domicilio,
 * el resto directamente desde su sección.
 *
 * Función pura — no tiene efectos secundarios ni accede al store.
 * Se puede usar tanto en isSectionComplete como en el componente.
 */
function getFieldValueFromData(
  formData: any,
  section: "ine" | "nomina" | "banco",
  fieldId: string,
): string {
  const data = formData[section] as any;
  if (!data) return "";

  const isDomicilioField = (DOMICILIO_FIELDS as readonly string[]).includes(
    fieldId,
  );
  if (section === "ine" && isDomicilioField) {
    return data.domicilio?.[fieldId] ?? "";
  }

  return data[fieldId] ?? "";
}

/**
 * Determina si un campo está lleno según sus reglas específicas.
 * ingresoMensual requiere ser un número mayor a 0.
 * El resto requiere al menos un carácter no vacío.
 */
function isFieldFilled(fieldId: string, value: string): boolean {
  if (fieldId === "ingresoMensual") return Number(value) > 0;
  return String(value).trim().length > 0;
}

/**
 * Renderiza el input correcto según el tipo de campo.
 * Extraído del JSX para mejorar legibilidad y facilitar pruebas unitarias.
 *
 * Recibe las props compartidas y el handler de actualización,
 * y devuelve el componente especializado correspondiente.
 */
function renderField(
  field: FieldDef,
  val: string,
  isFilled: boolean,
  onUpdate: (value: string) => void,
): React.ReactElement {
  /**
   * Props compartidas por todos los inputs.
   * Se pasan con spread para no repetirlas en cada case.
   */
  const shared = {
    id: field.id,
    inputSize: "sm" as const,
    required: true,
    success: isFilled,
    // Solo muestra error si el campo está vacío —
    // los errores de formato los manejan los componentes especializados
    error: !isFilled ? "Obligatorio" : undefined,
    placeholder: field.placeholder,
    value: val,
  };

  switch (field.id) {
    // Nombres y apellidos — solo letras, mayúsculas, máximo 40 caracteres
    case "primerNombre":
    case "segundoNombre":
    case "primerApellido":
    case "segundoApellido":
    // Campos de dirección — mismas reglas que nombres
    case "calle":
    case "colonia":
    case "municipio":
    case "estado":
    // Banco — nombre de institución bancaria
    case "banco":
      return <NameInput {...shared} maxLength={40} onChange={onUpdate} />;

    // Campos laborales — nombres de instituciones, más largos
    case "dependencia":
    case "departamento":
    case "puesto":
      return <NameInput {...shared} maxLength={40} onChange={onUpdate} />;

    // CURP — 18 caracteres alfanuméricos, formato oficial validado
    case "curp":
      return <CURPInput {...shared} onChange={onUpdate} />;

    // Sexo — selector H/M según formato del INE
    case "sexo":
      return (
        <SexSelect
          id={field.id}
          value={val}
          required
          error={!isFilled ? "Obligatorio" : undefined}
          onChange={onUpdate}
        />
      );

    // Fecha de nacimiento — calendario nativo, rango 1935 a (hoy - 18 años)
    case "fechaNacimiento":
      return <DateInput {...shared} onChange={onUpdate} />;

    // Código postal — exactamente 5 dígitos
    case "codigoPostal":
      return <NumericInput {...shared} maxLength={5} onChange={onUpdate} />;

    // No. exterior — hasta 6 dígitos
    case "noExt":
      return <NumericInput {...shared} maxLength={6} onChange={onUpdate} />;

    // No. de cuenta bancaria y No. empleado — hasta 10 dígitos
    case "noCuenta":
    case "noEmpleado":
      return <NumericInput {...shared} maxLength={10} onChange={onUpdate} />;

    // Ingreso mensual — número sin decimales, sin límite práctico de dígitos
    case "ingresoMensual":
      return <NumericInput {...shared} maxLength={10} onChange={onUpdate} />;

    // RFC — 13 caracteres, formato validado
    case "rfc":
      return <RFCInput {...shared} onChange={onUpdate} />;

    // CLABE — 18 dígitos, dígito verificador validado con algoritmo BANXICO
    case "clabe":
      return <CLABEInput {...shared} onChange={onUpdate} />;

    // Input genérico para campos que no tienen restricciones especiales
    default:
      return <Input {...shared} onChange={(e) => onUpdate(e.target.value)} />;
  }
}

// ─── Componente ───────────────────────────────────────────────────────────────

function RevisionDatos() {
  /**
   * Solo una sección puede estar abierta a la vez.
   * Inicia con "personales" abierta para que el asesor
   * vea inmediatamente los datos del INE al llegar a este paso.
   */
  const [expandedSection, setExpandedSection] = useState<SectionId | null>(
    "personales",
  );

  const formData = useContractStore((s) => s.formData);
  const setFormData = useContractStore((s) => s.setFormData);

  /**
   * Calcula el estado de completitud de cada sección.
   * useMemo evita recalcular cuando cambian partes del estado
   * que no afectan a formData.
   */
  const completion: Record<SectionId, boolean> = useMemo(
    () => ({
      personales: isSectionComplete("personales", formData),
      domicilio: isSectionComplete("domicilio", formData),
      laborales: isSectionComplete("laborales", formData),
      bancarios: isSectionComplete("bancarios", formData),
    }),
    [formData],
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  /**
   * Abre o cierra una sección del accordion.
   * Si ya estaba abierta, la cierra (toggle).
   */
  const toggleSection = (id: SectionId) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  /**
   * Actualiza el valor de un campo en el store.
   *
   * Los campos de domicilio se guardan anidados dentro de ine.domicilio
   * para mantener la estructura que espera el backend.
   * El resto se guarda directamente en su sección.
   */
  const update = (
    section: "ine" | "nomina" | "banco",
    field: string,
    value: string,
  ) => {
    const isDomicilioField = (DOMICILIO_FIELDS as readonly string[]).includes(
      field,
    );

    if (section === "ine" && isDomicilioField) {
      // Actualiza solo el campo dentro de domicilio,
      // preservando el resto de los campos del domicilio actual
      setFormData("ine", {
        ...(formData.ine as any),
        domicilio: {
          ...(formData.ine as any)?.domicilio,
          [field]: value,
        },
      });
    } else {
      // Actualiza el campo directamente en su sección
      setFormData(section, {
        ...(formData[section] as any),
        [field]: value,
      });
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4 md:p-6">
      {/* Encabezado de la sección */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Revisar Datos
        </h2>
        <p className="text-sm text-text-secondary">
          Verifica que la información sea correcta
        </p>
      </div>

      {/* Lista de secciones tipo accordion */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          const isComplete = completion[section.id];
          const isCollapsedWithIssues = !isExpanded && !isComplete;

          /**
           * Color del borde según el estado de la sección:
           *   Verde  → todos los campos completos
           *   Rojo   → colapsada con campos vacíos (llamada a la atención)
           *   Default → expandida con campos pendientes (neutro)
           */
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
              {/* Header del accordion — clic abre/cierra la sección */}
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

                  {/* Indicador de estado — check verde o alerta naranja */}
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

                {/* Flecha animada que indica si está abierta o cerrada */}
                <ChevronDown
                  size={18}
                  className={`text-text-secondary transition-transform shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Cuerpo del accordion — visible solo cuando está expandida */}
              {isExpanded && (
                <div id={`section-${section.id}`} className="px-4 md:px-5 pb-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => {
                      const val = getFieldValueFromData(
                        formData,
                        section.section,
                        field.id,
                      );
                      const isFilled = isFieldFilled(field.id, val);

                      return (
                        <div key={field.id} className="space-y-1.5">
                          {/*
                            El label está separado del input por diseño —
                            los inputs especializados no tienen label propio
                            para poder controlarlo desde aquí con estilos consistentes
                          */}
                          <label
                            htmlFor={field.id}
                            className="text-xs font-medium text-text-secondary"
                          >
                            {field.label}
                            {
                              <span
                                className="text-error ml-0.5"
                                aria-hidden="true"
                              >
                                *
                              </span>
                            }
                          </label>

                          {/*
                            renderField decide qué componente usar según el campo.
                            Está definido fuera del componente para no recrearlo
                            en cada render y para mantener el JSX limpio.
                          */}
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
