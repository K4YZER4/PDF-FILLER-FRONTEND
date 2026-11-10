/** Guard de ruta para páginas públicas (login).
 *  Si el usuario ya está autenticado, redirige a /.
 *  Si no está autenticado, renderiza los children. */
import { Navigate } from "react-router-dom"
import { useContractStore } from "@/store/useContractStore"
import { getToken, isTokenExpired } from "@/lib/auth"

function PublicRoute({ children }: { children: React.ReactNode }) {
  // Lee del store si hay sesión activa
  const isAuthenticated = useContractStore((s) => s.auth.isAuthenticated)
  const token = getToken()
  const hasValidToken = Boolean(token && !isTokenExpired(token))
  return !(isAuthenticated && hasValidToken) ? <>{children}</> : <Navigate to="/app" replace />
}

export { PublicRoute }
