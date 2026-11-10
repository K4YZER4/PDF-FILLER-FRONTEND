/** Guard de ruta para proteger páginas que requieren autenticación.
 *  Si el usuario no está autenticado, redirige a /login.
 *  Si está autenticado, renderiza los children. */
import { Navigate } from "react-router-dom"
import { useContractStore } from "@/store/useContractStore"
import { getToken, isTokenExpired } from "@/lib/auth"
import { DemoKeyRoute } from "./DemoKeyRoute"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Lee del store si hay sesión activa
  const isAuthenticated = useContractStore((s) => s.auth.isAuthenticated)
  const token = getToken()
  const hasValidToken = Boolean(token && !isTokenExpired(token))
  return isAuthenticated && hasValidToken
    ? <DemoKeyRoute>{children}</DemoKeyRoute>
    : <Navigate to="/login" replace />
}

export { PrivateRoute }
