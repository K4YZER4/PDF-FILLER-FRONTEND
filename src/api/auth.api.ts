/** Servicio de autenticación. POST /api/auth/login */
import { api } from "@/lib/api"
import { setToken } from "@/lib/auth"
import type { ApiResponse, LoginRequest, LoginResponse } from "@/types/api"

const AUTH_URL = "/api/auth/login"

/** Envía credenciales al backend, guarda el JWT y retorna los datos del usuario. */
export async function login(data: LoginRequest, remember = true) {
  const res = await api.post<ApiResponse<LoginResponse>>(AUTH_URL, data)
  const { token, user } = res.data.data
  setToken(token, remember)
  return { token, user }
}
