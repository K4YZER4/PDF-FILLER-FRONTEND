/**
 * Archivo: features/historial/HistorialPage.tsx
 * Propósito: Pantalla de historial con diseño profesional.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, LogOut, Search, Eye, Share2, Filter } from "lucide-react"
import { Button, Input, Card, Badge } from "@/components"
import { useContractStore } from "@/store/useContractStore"

function HistorialPage() {
  const navigate = useNavigate()
  const { auth, logout, history } = useContractStore()
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState("todos")
  const [asesorFilter, setAsesorFilter] = useState("todos")

  const asesores = Array.from(new Set(history.contracts.map((c: any) => c.asesor)))

  const filteredContracts = history.contracts.filter((contract: any) => {
    if (search && !contract.clientName.toLowerCase().includes(search.toLowerCase())) return false
    if (auth.role === "admin" && asesorFilter !== "todos" && contract.asesor !== asesorFilter) return false
    if (dateFilter !== "todos") {
      const today = new Date().toISOString().split("T")[0]
      if (dateFilter === "hoy" && contract.date !== today) return false
      if (dateFilter === "semana") {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        if (new Date(contract.date) < weekAgo) return false
      }
    }
    return true
  })

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const handleShare = async (contract: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contrato ${contract.id}`,
          text: `Contrato de ${contract.clientName}`,
          url: `${window.location.origin}/contrato/${contract.id}`,
        })
      } catch {}
    } else {
      alert("Copiado: " + `${window.location.origin}/contrato/${contract.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-stone-900">Historial</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/contrato/nuevo")}
            >
              <Plus size={14} /> Nuevo contrato
            </Button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-6 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["todos", "hoy", "semana"].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-4 py-2 text-xs rounded-full border transition-all ${
                dateFilter === filter
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-stone-600 border-stone-200 hover:border-primary"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}

          {auth.role === "admin" && (
            <div className="flex items-center gap-2 ml-auto">
              <Filter size={14} className="text-stone-500" />
              <select
                value={asesorFilter}
                onChange={(e) => setAsesorFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-stone-200 bg-white text-stone-600"
              >
                <option value="todos">Todos los asesores</option>
                {asesores.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {filteredContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-sm text-stone-500">Sin contratos aún</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/contrato/nuevo")}
            >
              <Plus size={14} /> Crear primer contrato
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContracts.map((contract: any) => (
              <Card key={contract.id} className="p-5 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900">{contract.clientName}</h3>
                      <p className="text-xs text-stone-500">{contract.date} · {contract.asesor}</p>
                    </div>
                    <Badge variant={contract.status === "completado" ? "success" : "warning"}>
                      {contract.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-stone-500">Monto</p>
                      <p className="font-semibold text-primary">${contract.monto?.toLocaleString() || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Plazo</p>
                      <p className="font-semibold">{contract.plazo} QNAs</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => navigate(`/contrato/${contract.id}`)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleShare(contract)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export { HistorialPage }
