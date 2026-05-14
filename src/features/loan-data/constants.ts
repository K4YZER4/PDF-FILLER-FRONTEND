/**
 * Archivo: features/loan-data/constants.ts
 *
 * Constantes de dominio para el paso 3.
 * Centralizadas aquí para evitar valores hardcodeados dentro de componentes.
 * Cuando el backend exponga estos catálogos, se reemplazarán por llamadas API.
 */

/** Lista fija de asesores disponibles. El admin puede seleccionar uno; los demás usuarios tienen su nombre asignado automáticamente. */
export const ASESORES_REGISTRADOS = [
  "MARIA LOPEZ GARCIA",
  "JORGE CRUZ SOTO",
  "ANA GARCIA MARTINEZ",
  "PEDRO MARTINEZ RAMIREZ",
] as const

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
