/**
 * Archivo: features/auth/LoginPage.tsx
 * Propósito: Pantalla de inicio de sesión (Login).
 * Permite autenticación con credenciales hardcodeadas para el mockup.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, AlertCircle } from "lucide-react"
import { Button, Input } from "@/components"
import { useContractStore } from "@/store/useContractStore"
import type { UserRole } from "@/store/useContractStore"

/** Credenciales hardcodeadas para el mockup */
const MOCK_USERS: { email: string; password: string; role: UserRole }[] = [
  { email: "asesor@credifom.mx", password: "1234", role: "asesor" },
  { email: "admin@credifom.mx", password: "1234", role: "admin" },
]

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const login = useContractStore((state) => state.login)
  const navigate = useNavigate()

  /** Maneja el envío del formulario de login */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      setError("Credenciales incorrectas. Intenta de nuevo.")
      return
    }

    login(user.email, user.role)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Tarjeta de login centrada */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-stone-200 p-6 space-y-6">
        {/* Header con logo y nombre de la app */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
            <FileText size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-stone-900">Generador de Contratos</h1>
            <p className="text-sm text-stone-500">CREDIFOM, S.A.P.I. de C.V.</p>
          </div>
        </div>

        {/* Formulario de login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuario */}
          <div className="flex flex-col gap-0.5">
            <label htmlFor="email" className="text-xs font-medium text-stone-500">
              Usuario
            </label>
            <Input
              id="email"
              type="email"
              placeholder="asesor@credifom.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "border-error border-red-300 bg-error-tint" : ""}
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex flex-col gap-0.5">
            <label htmlFor="password" className="text-xs font-medium text-stone-500">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="1234"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "border-error border-red-300 bg-error-tint" : ""}
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="flex items-center gap-2 text-xs text-error bg-error-tint border border-error-border rounded-md p-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Botón de envío */}
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Iniciar sesión
          </Button>
        </form>

        {/* Credenciales de prueba */}
        <div className="text-[11px] text-stone-400 bg-stone-50 rounded-md p-3 space-y-1">
          <p className="font-medium text-stone-500">Credenciales de prueba:</p>
          <p>Asesor: asesor@credifom.mx / 1234</p>
          <p>Admin: admin@credifom.mx / 1234</p>
        </div>
      </div>
    </div>
  )
}

export { LoginPage }
