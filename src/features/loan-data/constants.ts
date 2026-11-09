/**
 * Archivo: features/loan-data/constants.ts
 *
 * Constantes de dominio para el paso 3.
 * Centralizadas aquí para evitar valores hardcodeados dentro de componentes.
 * Cuando el backend exponga estos catálogos, se reemplazarán por llamadas API.
 */
import { Phone, type LucideIcon } from "lucide-react"

/** Meses del año para el selector de "Mes de Descuento". */
export const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
] as const

/** Opciones de estado civil para el selector correspondiente. */
export const ESTADOS_CIVILES = [
  "SOLTERO", "CASADO", "DIVORCIADO", "UNIÓN LIBRE",
] as const

/** Opciones de tipo de propiedad para el selector correspondiente. */
export const PROPIEDAD_OPCIONES = [
  "PROPIA", "RENTADA", "FAMILIAR",
] as const

/** Plazos predefinidos en quincenas. Se renderizan como botones de selección. */
export const PLAZOS_QNA = [24, 36, 48, 72, 96, 120] as const

/** Definición de un campo de formulario para el paso 3.
 *  Usado por el renderer genérico (fieldRenderer.tsx) para mapear
 *  config → componente de input. */
export interface LoanFieldDef {
  id: string
  label: string
  placeholder: string
  type: "name" | "numeric" | "date" | "email" | "select"
  maxLength?: number
  section: "contactoData"
  /** Opciones fijas para campos de tipo select (ej. estado civil). */
  selectOptions?: readonly string[]
}

/** Definición de una sección del accordion del paso 3
 *  que usa el patrón config-driven para renderizar sus campos. */
export interface LoanSectionDef {
  id: string
  title: string
  icon: LucideIcon
  fields: LoanFieldDef[]
}

/** Secciones del paso 3 renderizadas con el patrón config-driven.
 *  Cada entrada genera automáticamente los campos mediante fieldRenderer.
 *  Prestamo/Asesor quedan fuera porque tienen lógica de negocio única. */
export const loanSections: LoanSectionDef[] = [
  {
    id: "contacto",
    title: "Contacto y Estado Civil",
    icon: Phone,
    fields: [
      { id: "tel",         label: "Tel",         placeholder: "6871234567",        type: "numeric", maxLength: 10, section: "contactoData" },
      { id: "celular",     label: "Celular",     placeholder: "6871234567",        type: "numeric", maxLength: 10, section: "contactoData" },
      { id: "telCasa",     label: "Tel. Casa",   placeholder: "6871234567",        type: "numeric", maxLength: 10, section: "contactoData" },
      { id: "correo",      label: "Correo",      placeholder: "correo@ejemplo.com", type: "email",  section: "contactoData" },
      { id: "estadoCivil", label: "Estado Civil", placeholder: "Seleccionar",       type: "select", section: "contactoData", selectOptions: ESTADOS_CIVILES },
      { id: "dependientesEconomicos", label: "Dep. económicos", placeholder: "Ej: 2", type: "numeric", maxLength: 2, section: "contactoData" },
      { id: "propiedad",   label: "Vivienda",    placeholder: "Seleccionar",       type: "select", section: "contactoData", selectOptions: PROPIEDAD_OPCIONES },
      { id: "entreCalles", label: "Entre calles", placeholder: "Ej: Calle 1 y Calle 2", type: "name", maxLength: 60, section: "contactoData" },
    ],
  },
]
