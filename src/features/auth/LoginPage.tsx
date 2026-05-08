/** Pantalla de inicio de sesión con credenciales mock.
 *  Valida contra MOCK_USERS y redirige a / en caso de éxito.
 *  Muestra error si las credenciales son incorrectas. */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { Button, Input, Card } from "@/shared/components"
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
  const login = useContractStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!user) { setError("Credenciales incorrectas."); return }
    login(user.email, user.role)
    navigate("/")
  }

  return (
    <Card className="p-8 md:p-10 space-y-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-text-secondary">Usuario</label>
          <Input id="email" type="email" placeholder="asesor@credifom.mx" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-text-secondary">Contraseña</label>
          <Input id="password" type="password" placeholder="1234" value={password} onChange={(e) => setPassword(e.target.value)} error={error} />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-xs text-error bg-error-tint border border-error/10 rounded-lg p-3">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        <Button type="submit" size="lg" className="w-full">Iniciar sesión</Button>
      </form>
      <div className="text-[11px] text-text-secondary bg-bg rounded-lg p-4 space-y-1">
        <p className="font-medium text-text-primary">Credenciales de prueba:</p>
        <p>Asesor: asesor@credifom.mx / 1234</p>
        <p>Admin: admin@credifom.mx / 1234</p>
      </div>
    </Card>
  )
}

export { LoginPage }
