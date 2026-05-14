/** Componente raíz. Define las rutas de la app con React Router.
 *  - /login     → AuthLayout + LoginPage (público)
 *  - /          → AppLayout + HistorialPage (privado)
 *  - /contracts → ContractLayout con sub-rutas para el flujo de 4 pasos */
import { Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { PrivateRoute, PublicRoute } from "@/routes"
import { AuthLayout } from "@/layouts/AuthLayout"
import { AppLayout } from "@/layouts/AppLayout"
import { ContractLayout } from "@/layouts/ContractLayout"
import { LoginPage } from "@/features/auth"
import { HistorialPage } from "@/features/history"
import { SubirDocs } from "@/features/upload-documents"
import { RevisionDatos } from "@/features/review-data"
import { CreditoAsesor } from "@/features/loan-data"
import { VistaPrevia } from "@/features/preview-contract"
import { Spinner } from "@/components"

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Spinner size="lg" /></div>}>
        <Routes>
          {/* Ruta pública: login */}
          <Route path="/login" element={<PublicRoute><AuthLayout><LoginPage /></AuthLayout></PublicRoute>} />
          {/* Ruta privada: historial principal */}
          <Route path="/" element={<PrivateRoute><AppLayout><HistorialPage /></AppLayout></PrivateRoute>} />
          {/* Ruta privada: flujo de contrato con 4 sub-rutas anidadas en ContractLayout */}
          <Route path="/contracts" element={<PrivateRoute><ContractLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="upload" replace />} />
            <Route path="upload" element={<SubirDocs />} />
            <Route path="review" element={<RevisionDatos />} />
            <Route path="loan" element={<CreditoAsesor />} />
            <Route path="preview" element={<VistaPrevia />} />
          </Route>
          {/* Catch-all: redirige a inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export { App }
