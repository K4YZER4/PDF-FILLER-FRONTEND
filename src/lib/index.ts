/**
 * Barrel export de la capa de infraestructura.
 */
export { api } from "./api"
export { setToken, getToken, removeToken, hasToken, decodeToken, isTokenExpired, authHeader } from "./auth"
export { ApiError, ValidationError, AuthError, NetworkError } from "./errors"
