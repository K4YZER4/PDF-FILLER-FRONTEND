/**
 * Archivo: features/loan-data/constants.ts
 *
 * Constantes de dominio para el paso 3.
 * Centralizadas aquí para evitar valores hardcodeados dentro de componentes.
 * Cuando el backend exponga estos catálogos, se reemplazarán por llamadas API.
 */
import { Phone, type LucideIcon } from "lucide-react"

/** Perfil completo de un asesor registrado (simulado hasta conectar backend). */
export interface AsesorRegistrado {
  nombre: string
  folio: string
  sucursal: string
  numVendedor: string
  lugar: string
  mesDescuento: string
  anioDescuento: string
}

/** Lista fija de asesores con datos completos. El admin selecciona por nombre y se auto-rellenan todos los campos. */
export const ASESORES_REGISTRADOS: AsesorRegistrado[] = [
  {
    nombre: "MARIA LOPEZ GARCIA",
    folio: "00001",
    sucursal: "SUCURSAL CENTRO",
    numVendedor: "001",
    lugar: "CIUDAD DE MEXICO",
    mesDescuento: "ENERO",
    anioDescuento: "2026",
  },
  {
    nombre: "JORGE CRUZ SOTO",
    folio: "00002",
    sucursal: "SUCURSAL NORTE",
    numVendedor: "002",
    lugar: "MONTERREY, N.L.",
    mesDescuento: "ENERO",
    anioDescuento: "2026",
  },
  {
    nombre: "ANA GARCIA MARTINEZ",
    folio: "00003",
    sucursal: "SUCURSAL SUR",
    numVendedor: "003",
    lugar: "PUEBLA, PUE.",
    mesDescuento: "ENERO",
    anioDescuento: "2026",
  },
  {
    nombre: "PEDRO MARTINEZ RAMIREZ",
    folio: "00004",
    sucursal: "SUCURSAL OCCIDENTE",
    numVendedor: "004",
    lugar: "GUADALAJARA, JAL.",
    mesDescuento: "ENERO",
    anioDescuento: "2026",
  },
]

/** Nombres de asesores para el dropdown del admin (derivado de ASESORES_REGISTRADOS). */
export const ASESOR_NOMBRES = ASESORES_REGISTRADOS.map(a => a.nombre)

/** Meses del año para el selector de "Mes de Descuento". */
export const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
] as const

/** Opciones de estado civil para el selector correspondiente. */
export const ESTADOS_CIVILES = [
  "SOLTERO", "CASADO", "DIVORCIADO", "UNIÓN LIBRE",
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
    ],
  },
]
