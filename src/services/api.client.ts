/**
 * Archivo: services/api.client.ts
 * Propósito: Cliente HTTP personalizado para comunicarse con el backend API.
 * Maneja peticiones fetch, errores y proporciona métodos para diferentes tipos de datos.
 */
import type { ApiError } from "@/types"

// URL base del API obtenida de las variables de entorno (.env)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000"

/**
 * Realiza una petición GET/POST genérica y devuelve JSON tipado.
 * @param endpoint - Ruta del endpoint (ej: "/api/ine/escanear-ine")
 * @param options - Opciones de fetch (method, headers, body, etc.)
 * @throws ApiError - Si la respuesta no es exitosa
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const apiError: ApiError = {
      error: errorData.error || `HTTP ${response.status}`,
      status: response.status,
    }
    throw apiError
  }

  return response.json()
}

/**
 * Realiza una petición que devuelve un archivo Blob (ej: PDF).
 * Útil para descargar archivos generados por el servidor.
 */
async function apiFetchBlob(
  endpoint: string,
  options: RequestInit = {}
): Promise<Blob> {
  const url = `${API_BASE}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const apiError: ApiError = {
      error: errorData.error || `HTTP ${response.status}`,
      status: response.status,
    }
    throw apiError
  }

  return response.blob()
}

/**
 * Envía datos de formulario (FormData) mediante POST.
 * Ideal para subir archivos junto con otros datos.
 */
async function apiPostForm<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: "POST",
    body: formData,
  })
}

/**
 * Envía datos JSON mediante POST.
 * Convierte el body a JSON y establece el Content-Type adecuado.
 */
async function apiPostJson<TRequest, TResponse>(
  endpoint: string,
  body: TRequest
): Promise<TResponse> {
  return apiFetch<TResponse>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
}

export { apiFetch, apiFetchBlob, apiPostForm, apiPostJson, API_BASE }
