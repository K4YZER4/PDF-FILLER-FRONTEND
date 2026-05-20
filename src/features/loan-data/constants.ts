/**
 * Archivo: features/loan-data/constants.ts
 *
 * Constantes de dominio para el paso 3.
 * Centralizadas aquí para evitar valores hardcodeados dentro de componentes.
 * Cuando el backend exponga estos catálogos, se reemplazarán por llamadas API.
 */

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
