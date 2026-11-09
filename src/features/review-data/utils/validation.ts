/** Utilidades de validación para el paso de revisión de datos (step 2).
 *  Funciones puras que determinan si secciones/campos están completos,
 *  sin depender de React ni del store.
 *
 *  Separadas de RevisionDatos.tsx para:
 *   - Facilitar tests unitarios (sin mocking de React/store)
 *   - Reutilizar la lógica en otros pasos si es necesario
 *   - Mantener el componente enfocado solo en UI y orquestación
 *
 *  Uso:
 *    import { isSectionComplete } from "./utils/validation"; */
import type { FormDataState } from "@/types/store";
import {
  sections,
  type SectionId,
} from "@/constants/revisionFields";

/** Campos que se almacenan dentro de ine.domicilio en lugar de ine directamente. */
const DOMICILIO_FIELDS: readonly string[] = [
  "calle",
  "codigoPostal",
  "colonia",
  "noExt",
  "noInt",
  "municipio",
  "estado",
];

/** Lee el valor de un campo del formData.
 *  Los campos de domicilio se leen desde ine.domicilio,
 *  el resto directamente desde su sección. */
export function getFieldValueFromData(
  formData: FormDataState,
  section: "ine" | "nomina" | "banco",
  fieldId: string,
): string {
  const isDomicilioField = DOMICILIO_FIELDS.includes(fieldId);
  if (section === "ine" && isDomicilioField) {
    return formData.ine.domicilio?.[fieldId as keyof NonNullable<typeof formData.ine.domicilio>] ?? "";
  }
  const data = formData[section];
  if (!data) return "";
  return data[fieldId as keyof typeof data] ?? "";
}

/** Determina si un campo está lleno según sus reglas específicas.
 *  ingresoMensual requiere ser un número mayor a 0.
 *  El resto requiere al menos un carácter no vacío. */
export function isFieldFilled(fieldId: string, value: string): boolean {
  if (fieldId === "ingresoMensual") return Number(value) > 0;
  return String(value).trim().length > 0;
}

/** Verifica si todos los campos de una sección están completos.
 *  Reglas especiales:
 *   - ingresoMensual debe ser un número mayor a 0
 *   - El resto de campos deben tener al menos un carácter no vacío */
export function isSectionComplete(id: SectionId, formData: FormDataState): boolean {
  const section = sections.find((s) => s.id === id);
  if (!section) return false;

  return section.fields.every((f) => {
    const val = getFieldValueFromData(formData, section.section, f.id);
    if (f.id === "ingresoMensual") return Number(val) > 0;
    return String(val).trim().length > 0;
  });
}

export { DOMICILIO_FIELDS };
