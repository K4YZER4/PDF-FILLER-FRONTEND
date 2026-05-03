/**
 * Archivo: features/historial/HistorialPage.tsx
 * Propósito: Pantalla de historial de contratos.
 */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, LogOut, Search, Eye, Share2, Filter } from "lucide-react"
import { Button, Input } from "@/components"
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
    <div className="min-h-screen bg-stone-100 flex flex-col max-w-md mx-auto">
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm flex items-center justify-between px-4 py-3">
        <span className="text-sm font-semibold">Historial</span>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => navigate("/contrato/nuevo")}>
            <Plus size={14} /> Nuevo contrato
          </Button>
          <button onClick={handleLogout} className="w-9 h-9 rounded-md flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {["todos", "hoy", "semana"].map((filter) => (
            <button key={filter} onClick={() => setDateFilter(filter)}
              className={`px-3 py-1.5 text-xs rounded-full border ${
                dateFilter === filter ? "bg-primary text-white border-primary" : "bg-white text-stone-600 border-stone-200"
              }`}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {auth.role === "admin" && (
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-stone-500" />
            <select value={asesorFilter} onChange={(e) => setAsesorFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-md border border-stone-200 bg-white">
              <option value="todos">Todos los asesores</option>
              {asesores.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-6 space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-sm text-stone-500">Sin contratos aún</p>
            <Button variant="primary" size="sm" onClick={() => navigate("/contrato/nuevo")}>
              <Plus size={14} /> Crear primer contrato
            </Button>
          </div>
        ) : (
          filteredContracts.map((contract: any) => (
            <div key={contract.id} className="bg-white border border-stone-200 rounded-lg p-4 space-y-2 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{contract.clientName}</h3>
                  <p className="text-xs text-stone-500">{contract.date} · {contract.asesor}</p>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  contract.status === "completado" ? "bg-success-tint text-success" : "bg-warning-tint text-warning"
                }`}>
                  {contract.status}
                </span>
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
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/contrato/${contract.id}`)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => handleShare(contract)}
                    className="w-8 h-8 rounded-md flex items-center justify-center text-stone-500 border border-stone-200 hover:bg-stone-50">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export { HistorialPage }
