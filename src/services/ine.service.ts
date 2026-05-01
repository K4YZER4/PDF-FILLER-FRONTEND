/**
 * Archivo: services/ine.service.ts
 * Propósito: Servicio para el escaneo de la INE (Identificación Nacional Electoral).
 * Envía la imagen al backend para extraer datos mediante OCR.
 */
import { apiPostForm } from "./api.client"
import type { ScanINEFields } from "@/types"

/**
 * Escanea una imagen de la INE y extrae los datos mediante OCR.
 * @param file - Archivo de imagen de la INE (JPG, PNG, PDF)
 * @returns Datos extraídos de la INE (nombre, CURP, domicilio, etc.)
 */
async function scanINE(file: File): Promise<ScanINEFields> {
  const formData = new FormData()
  formData.append("ine", file)
  return apiPostForm<ScanINEFields>("/api/ine/escanear-ine", formData)
}

export { scanINE }
