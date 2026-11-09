/**
 * Archivo: src/lib/api.ts
 *
 * Cliente HTTP centralizado para toda la aplicación.
 *
 * Responsabilidades:
 *   1. Crear una instancia de axios con la base URL desde VITE_API_BASE
 *   2. Interceptor de request: adjuntar token JWT automáticamente
 *   3. Interceptor de response: normalizar errores a nuestras clases tipadas
 *   4. Interceptor de response: refrescar token automáticamente si expiró (futuro)
 *
 * Uso:
 *   import { api } from "@/lib/api"
 *   const contracts = await api.get("/contracts").then(r => r.data)
 *
 * Configuración:
 *   VITE_API_BASE=http://localhost:3001 en .env
 */

import axios from "axios"
import { getToken, removeToken, isTokenExpired } from "./auth"
import { ApiError, ValidationError, AuthError, NetworkError } from "./errors"

/** Instancia de axios preconfigurada */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3001",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ─── Interceptor de request: adjuntar token ─────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`

      // Si el token está expirado, no enviamos el request
      if (isTokenExpired(token)) {
        removeToken()
        window.location.href = "/login"
        return Promise.reject(new AuthError("Sesión expirada. Inicia sesión nuevamente."))
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Interceptor de response: normalizar errores ────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(new NetworkError())
    }

    if (error.response) {
      const { status, data } = error.response

      if (status === 401) {
        removeToken()
        // No redirigimos automáticamente — el AuthError se maneja donde se use
        return Promise.reject(new AuthError(data?.message || "Sesión expirada"))
      }

      if (status === 422 && data?.errors) {
        return Promise.reject(new ValidationError(data.errors, data?.message))
      }

      return Promise.reject(
        new ApiError(status, data?.message || "Error del servidor", data?.code),
      )
    }

    return Promise.reject(new NetworkError())
  },
)

export { api }
