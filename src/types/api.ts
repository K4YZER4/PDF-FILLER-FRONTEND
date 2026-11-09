/**
 * Archivo: src/types/api.ts
 *
 * Tipos compartidos para las respuestas de la API REST.
 * Estos tipos reflejan la respuesta real del backend Nest.
 *
 * Convención de respuestas:
 *   - Éxito: { data: T, message?: string }
 *   - Error:  { message: string, code?: string, errors?: Record<string, string[]> }
 */

/** Envoltura estándar de una respuesta exitosa del backend */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/** Respuesta paginada del backend */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    email: string
    role: "asesor" | "mesa" | "admin"
    name: string
    codigoEmpleado: string
    sucursal: string
    profile: {
      folio: string
      sucursal: string
      numVendedor: string
      asesor: string
    } | null
  }
}

// ─── Contratos ──────────────────────────────────────────────────────────────

export interface ContractDTO {
  id: string
  clientName: string
  date: string
  monto: number
  plazo: number
  asesor: string
  status: "borrador" | "completado" | "cancelado"
  estado: string
}

export interface CreateContractRequest {
  ineData: Record<string, unknown>
  nominaData: Record<string, unknown>
  bancoData: Record<string, unknown>
  asesorData: Record<string, string>
  contactoData: Record<string, string>
  antiguedadData: Record<string, string>
  referencias: Array<Record<string, string>>
  capitalMonto: number
  plazoQnas: number
}

// ─── Documentos / OCR ───────────────────────────────────────────────────────

export interface UploadDocumentRequest {
  file: File
  documentType: "ine" | "nomina1" | "nomina2" | "estadoCuenta"
}

export interface ScanResult {
  documentType: string
  success: boolean
  extractedData: Record<string, unknown>
  confidence: number
}
