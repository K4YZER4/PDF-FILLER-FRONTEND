import { Navigate, useLocation } from "react-router-dom"
import { getDemoApiKey } from "@/lib/demoKey"

function isDemoMode(): boolean {
  return import.meta.env.VITE_DEMO_MODE === "true"
}

function DemoKeyRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (isDemoMode() && !getDemoApiKey()) {
    return <Navigate to="/demo" replace state={{ from: location.pathname }} />
  }
  return <>{children}</>
}

export { DemoKeyRoute, isDemoMode }
