/**
 * Archivo: services/nomina.service.ts
 * Propósito: Servicios para el escaneo de recibos de nómina y estados de cuenta.
 * Extrae datos laborales y bancarios mediante OCR.
 */
import { apiPostForm } from "./api.client"
import type { NominaData, EstadoCuentaData } from "@/types"

/**
 * Escanea dos recibos de nómina y extrae datos laborales.
 * @param nomina1 - Primer recibo de nómina
 * @param nomina2 - Segundo recibo de nómina
 * @returns Datos extraídos (RFC, puesto, salario, etc.)
 */
async function scanNomina(
  nomina1: File,
  nomina2: File
): Promise<NominaData> {
  const formData = new FormData()
  formData.append("nomina1", nomina1)
  formData.append("nomina2", nomina2)
  const response = await apiPostForm<{ datos: NominaData }>(
    "/api/escanear-nomina",
    formData
  )
  return response.datos
}

/**
 * Escanea un estado de cuenta bancario y extrae datos bancarios.
 * @param file - Archivo del estado de cuenta
 * @returns Datos extraídos (número de cuenta, CLABE, banco)
 */
async function scanEstadoCuenta(file: File): Promise<EstadoCuentaData> {
  const formData = new FormData()
  formData.append("estadoCuenta", file)
  const response = await apiPostForm<{ datos: EstadoCuentaData }>(
    "/api/escanear-estado-cuenta",
    formData
  )
  return response.datos
}

export { scanNomina, scanEstadoCuenta }
