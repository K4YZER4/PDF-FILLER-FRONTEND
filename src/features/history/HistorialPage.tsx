/** Pantalla de historial de contratos generados.
 *  - Buscador por nombre del cliente.
 *  - Grid de tarjetas responsive (1/2/3 columnas).
 *  - Cada tarjeta muestra: nombre, fecha, asesor, monto, plazo, badge de estado.
 *  - Botones: Ver (navega a preview) y Compartir (navigator.share con fallback clipboard). */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Share2, Search } from "lucide-react";
// Componentes
import { Input, Badge } from "@/components";
import { Card } from "@/features/history/components/index";

import { useContractStore } from "@/store/useContractStore";

function HistorialPage() {
  const navigate = useNavigate();
  const history = useContractStore((s) => s.history);
  const [search, setSearch] = useState("");

  const filtered = history.contracts.filter(
    (c: any) =>
      !search || c.clientName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleShare = async (contract: any) => {
    const url = `${window.location.origin}/contracts/preview`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Contrato ${contract.id}`,
          text: `Contrato de ${contract.clientName}`,
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 space-y-4">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <p className="text-sm text-text-secondary">No hay contratos aún</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contract: any) => (
            <Card
              key={contract.id}
              className="p-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">
                      {contract.clientName}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {contract.date} · {contract.asesor}
                    </p>
                  </div>
                  <Badge
                    variant={
                      contract.status === "completado" ? "success" : "warning"
                    }
                  >
                    {contract.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-xs text-text-secondary">Monto</p>
                    <p className="font-semibold text-primary">
                      ${contract.monto?.toLocaleString() || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Plazo</p>
                    <p className="font-semibold">{contract.plazo} QNAs</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/contracts/preview`)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => handleShare(contract)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary border border-border hover:bg-bg transition-colors"
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
  );
}

export { HistorialPage };
