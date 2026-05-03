/**
 * Archivo: App.tsx
 * Propósito: Componente raíz de la aplicación.
 * Configura las rutas de React Router y el layout principal.
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useContractStore } from "@/store/useContractStore"
import { LoginPage } from "@/features/auth"
import { HistorialPage } from "@/features/historial"
import { StepperLayout } from "@/features/stepper"
import { VistaPrevia } from "@/features/vistaprevia"

/**
 * Componente que protege rutas privadas.
 * Redirige a /login si no está autenticado.
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useContractStore((state) => state.auth.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * Componente que redirige usuarios autenticados.
 * Si ya hizo login, manda a la página principal.
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useContractStore((state) => state.auth.isAuthenticated)
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Ruta privada: Historial (página principal) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HistorialPage />
            </PrivateRoute>
          }
        />

        {/* Ruta privada: Nuevo contrato (flujo de 4 pasos) */}
        <Route
          path="/contrato/nuevo"
          element={
            <PrivateRoute>
              <StepperLayout />
            </PrivateRoute>
          }
        />

        {/* Ruta privada: Vista previa de contrato */}
        <Route
          path="/contrato/:id"
          element={
            <PrivateRoute>
              <VistaPrevia />
            </PrivateRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
