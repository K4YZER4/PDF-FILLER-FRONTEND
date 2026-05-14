/**
 * Archivo: src/lib/errors.ts
 *
 * Clases de error tipadas para el manejo de errores de API.
 * Permiten distinguir errores de red, del servidor (4xx/5xx),
 * y errores de validación del lado del servidor.
 *
 * Uso:
 *   try {
 *     await api.get("/contracts")
 *   } catch (e) {
 *     if (e instanceof ValidationError) {
 *       // Errores de validación por campo
 *     } else if (e instanceof ApiError) {
 *       // Error genérico del servidor
 *     }
 *   }
 */

/** Error genérico de API — lanzado cuando el servidor responde con un status distinto a 2xx */
export class ApiError extends Error {
  public readonly status: number
  public readonly code: string

  constructor(status: number, message: string, code: string = "UNKNOWN_ERROR") {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.code = code
  }
}

/** Error de validación del servidor — 422 Unprocessable Entity con errores por campo */
export class ValidationError extends ApiError {
  public readonly fields: Record<string, string[]>

  constructor(fields: Record<string, string[]>, message = "Error de validación") {
    super(422, message, "VALIDATION_ERROR")
    this.name = "ValidationError"
    this.fields = fields
  }
}

/** Error de autenticación — 401 Unauthorized */
export class AuthError extends ApiError {
  constructor(message = "Sesión expirada. Inicia sesión nuevamente.") {
    super(401, message, "UNAUTHORIZED")
    this.name = "AuthError"
  }
}

/** Error de red — no se pudo conectar con el servidor */
export class NetworkError extends Error {
  constructor(message = "No se pudo conectar con el servidor. Verifica tu conexión.") {
    super(message)
    this.name = "NetworkError"
  }
}
