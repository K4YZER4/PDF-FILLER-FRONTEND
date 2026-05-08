/** Guard de ruta para proteger páginas que requieren autenticación.
 *  Si el usuario no está autenticado, redirige a /login.
 *  Si está autenticado, renderiza los children. */
import { Navigate } from "react-router-dom"
import { useContractStore } from "@/store/useContractStore"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  // Lee del store si hay sesión activa
  const isAuthenticated = useContractStore((s) => s.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export { PrivateRoute }
