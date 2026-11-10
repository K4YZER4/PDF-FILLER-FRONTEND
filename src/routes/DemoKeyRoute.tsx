import { Navigate, useLocation } from "react-router-dom"
import { getDemoApiKey, isDemoMode } from "@/lib/demoKey"

function DemoKeyRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (isDemoMode() && !getDemoApiKey()) {
    return <Navigate to="/demo" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export { DemoKeyRoute, isDemoMode }
