/**
 * Archivo: utils/date.ts
 * Propósito: Utilidades para manejo de fechas.
 * Convierte formatos, calcula antigüedad laboral y obtiene meses por defecto.
 */

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD).
 * Acepta fechas en formato ISO o DD/MM/YYYY.
 * @param raw - Fecha en cualquier formato reconocido
 * @returns Fecha en formato ISO o cadena vacía si no es válida
 */
function convertToISO(raw: string): string {
  if (!raw) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("/")
    return `${yyyy}-${mm}-${dd}`
  }
  return raw
}

/**
 * Calcula la antigüedad laboral desde la fecha de ingreso hasta hoy.
 * @param fechaIngreso - Fecha de ingreso en formato ISO (YYYY-MM-DD)
 * @returns Objeto con meses y años de antigüedad
 */
function calculateSeniority(fechaIngreso: string): { meses: number; anos: number } {
  if (!fechaIngreso) return { meses:0, anos:0 }

  const [y, m, d] = fechaIngreso.split("-").map(Number)
  if (!y || !m || !d) return { meses:0, anos:0 }

  const inicio = new Date(y, m - 1, d)
  const hoy = new Date()

  let anos = hoy.getFullYear() - inicio.getFullYear()
  let meses = hoy.getMonth() - inicio.getMonth()
  const dias = hoy.getDate() - inicio.getDate()

  if (dias < 0) meses -= 1
  if (meses < 0) {
    anos -= 1
    meses += 12
  }
  if (anos < 0) {
    anos = 0
    meses = 0
  }

  return { meses, anos }
}

/**
 * Obtiene el mes actual en español para el inicio de descuentos.
 * @returns Nombre del mes actual en mayúsculas (ej: "ENERO")
 */
function getDefaultDischargeMonth(): string {
  const months = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ]
  return months[new Date().getMonth()]
}

export { convertToISO, calculateSeniority, getDefaultDischargeMonth }
