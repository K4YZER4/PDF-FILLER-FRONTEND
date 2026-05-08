/** Guard de ruta para páginas públicas (login).
 *  Si el usuario ya está autenticado, redirige a /.
 *  Si no está autenticado, renderiza los children. */
import { Navigate } from "react-router-dom"
import { useContractStore } from "@/store/useContractStore"

function PublicRoute({ children }: { children: React.ReactNode }) {
  // Lee del store si hay sesión activa
  const isAuthenticated = useContractStore((s) => s.auth.isAuthenticated)
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />
}

export { PublicRoute }
