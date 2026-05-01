/**
 * Archivo: services/credito.service.ts
 * Propósito: Servicios para cálculos crediticios y generación de contratos PDF.
 * Comunica con el backend para tablas de amortización y generación de PDF.
 */
import { apiFetchBlob, apiPostJson } from "./api.client"
import type {
  TablaCreditoData,
  TablaCreditoRequest,
  ContractGenerationPayload,
} from "@/types"

/**
 * Solicita al backend el cálculo de la tabla de crédito.
 * @param request - Datos del monto solicitado y plazo en quincenas
 * @returns Datos calculados (monto a pagar, descuento quincenal, CAT, etc.)
 */
async function calcularTabla(request: TablaCreditoRequest): Promise<TablaCreditoData> {
  return apiPostJson<TablaCreditoRequest, TablaCreditoData>(
    "/api/monto/filtrar-tabla",
    request
  )
}

/**
 * Genera el contrato PDF rellenado con todos los datos recolectados.
 * @param payload - Objeto con todos los datos del contrato (INE, nómina, crédito, extras)
 * @returns Blob del archivo PDF generado
 */
async function generarContrato(payload: ContractGenerationPayload): Promise<Blob> {
  return apiFetchBlob("/api/pdf/rellenar-pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
}

/**
 * Verifica si el backend API está disponible (health check).
 * @returns true si el backend responde correctamente, false en caso contrario
 */
async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE || "http://localhost:3000"}/health`, {
      signal: AbortSignal.timeout(3000), // Timeout de 3 segundos
    })
    return response.ok
  } catch {
    return false
  }
}

export { calcularTabla, generarContrato, testConnection }
