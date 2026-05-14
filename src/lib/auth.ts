/**
 * Archivo: src/lib/auth.ts
 *
 * Manejo de tokens JWT para autenticación contra el backend.
 *
 * Responsabilidades:
 *   1. Guardar/recuperar/eliminar el token de localStorage
 *   2. Decodificar el payload del JWT sin verificar firma (para extraer datos del usuario)
 *   3. Proveer el header Authorization para axios
 *   4. Detectar si el token está expirado
 *
 * NOTA: La verificación real del JWT la hace el backend en cada request.
 *       El frontend solo usa el token para autenticarse.
 */

const TOKEN_KEY = "credifom-token"

/** Guarda el JWT en localStorage */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

/** Recupera el JWT de localStorage */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/** Elimina el JWT de localStorage (logout) */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/** Retorna true si existe un token guardado */
export function hasToken(): boolean {
  return !!getToken()
}

/** Payload decodificado del JWT */
interface TokenPayload {
  sub: string
  role: string
  exp: number
  iat: number
}

/**
 * Decodifica el payload de un JWT sin verificar la firma.
 * Útil para leer datos del usuario (email, rol) sin llamar al backend.
 * Retorna null si el token no es un JWT válido.
 *
 * ADVERTENCIA: No verifica la firma. Solo para lectura de datos no sensibles
 * del lado del frontend (nombre de usuario, rol para UI).
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    return JSON.parse(atob(payload)) as TokenPayload
  } catch {
    return null
  }
}

/**
 * Retorna true si el token está expirado (según el campo `exp` del payload).
 * Si no se puede decodificar, asume que es inválido y retorna true.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded) return true
  return decoded.exp * 1000 < Date.now()
}

/** Retorna el header Authorization para axios */
export function authHeader(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
