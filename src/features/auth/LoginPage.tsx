/**
 * Archivo: features/auth/LoginPage.tsx
 * Propósito: Pantalla de inicio de sesión con diseño profesional.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, AlertCircle } from "lucide-react"
import { Button, Input, Card } from "@/components"
import { useContractStore } from "@/store/useContractStore"
import type { UserRole } from "@/store/useContractStore"

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      setError("Credenciales incorrectas. Intenta de nuevo.")
      return
    }

    login(user.email, user.role)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 md:p-10 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <FileText size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900">Generador de Contratos</h1>
              <p className="text-sm text-stone-500 mt-1">CREDIFOM, S.A.P.I. de C.V.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-medium text-stone-600">
                Usuario
              </label>
              <Input
                id="email"
                type="email"
                placeholder="asesor@credifom.mx"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "border-error" : ""}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-medium text-stone-600">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "border-error" : ""}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-error bg-error-tint border border-error-border rounded-lg p-3">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full">
              Iniciar sesión
            </Button>
          </form>

          <div className="text-[11px] text-stone-400 bg-stone-50 rounded-lg p-4 space-y-1">
            <p className="font-medium text-stone-500">Credenciales de prueba:</p>
            <p>Asesor: asesor@credifom.mx / 1234</p>
            <p>Admin: admin@credifom.mx / 1234</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export { LoginPage }
