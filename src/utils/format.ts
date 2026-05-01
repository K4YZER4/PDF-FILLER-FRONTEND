/**
 * Archivo: utils/format.ts
 * Propósito: Funciones de formateo para moneda, porcentajes y descarga de archivos.
 */

/**
 * Formatea un número como moneda mexicana (MXN).
 * Ejemplo: 1234.56 -> "$1,234.56 MXN"
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount)
}

/**
 * Formatea un número como porcentaje con 2 decimales.
 * Ejemplo: 16.5 -> "16.50%"
 */
function formatPercentage(value: number): string {
  return Number(value).toFixed(2) + "%"
}

/**
 * Descarga un archivo Blob con el nombre especificado.
 * Crea un enlace temporal y simula un clic para descargar.
 * @param blob - El archivo a descargar
 * @param filename - Nombre del archivo descargado
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export { formatCurrency, formatPercentage, downloadBlob }
