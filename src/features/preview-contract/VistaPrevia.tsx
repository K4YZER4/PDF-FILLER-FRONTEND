/** Paso 4 del flujo: Vista previa del contrato antes de finalizar.
 *  - Muestra una simulación visual del PDF (contenido placeholder).
 *  - Tarjeta con resumen: cliente, monto, plazo.
 *  - Botones: Descargar (genera blob PDF simulado), Editar (vuelve a /contracts/review).
 *  - Finalizar: muestra toast de éxito y redirige a /.
 *  - Plazo calculado como montoPagare / descuentoQuincenal. */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, Pencil, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

function VistaPrevia() {
  const store = useContractStore();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  const clientName =
    [
      (store.formData.ine as any)?.primerNombre,
      (store.formData.ine as any)?.segundoNombre,
      (store.formData.ine as any)?.primerApellido,
      (store.formData.ine as any)?.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase() || "CLIENTE";

  const montoPagare = store.formData.tabla?.montoPagare || 0;
  const plazo = store.formData.tabla
    ? Math.round(montoPagare / (store.formData.tabla?.descuentoQuincenal || 1))
    : 0;

  const handleDownload = () => {
    const blob = new Blob(["Contrato PDF"], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFinish = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Vista Previa
        </h2>
        <p className="text-sm text-text-secondary">
          Revisa el contrato antes de finalizar
        </p>
      </div>
      <Card className="p-6 md:p-8">
        <div className="border-b border-border pb-4 mb-6 text-center">
          <h3 className="text-lg font-bold text-primary">
            CONTRATO DE PRÉSTAMO
          </h3>
        </div>
        <div className="space-y-3 mb-6">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-3 bg-bg rounded"
              style={{ width: `${75 + Math.random() * 25}%` }}
            />
          ))}
        </div>
        <div className="text-center text-xs text-text-secondary">
          Página 1 de 4
        </div>
      </Card>
      <Card className="p-5 md:p-6 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Datos del Contrato
        </h3>
        {[
          { label: "Cliente", value: clientName },
          { label: "Monto", value: `$${montoPagare.toLocaleString()}` },
          { label: "Plazo", value: `${plazo} QNAs` },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary">{item.value}</span>
          </div>
        ))}
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={handleDownload}>
          <FileDown size={16} /> Descargar
        </Button>
        <Button
          variant="secondary"
          onClick={() => navigate("/contracts/review")}
        >
          <Pencil size={16} /> Editar
        </Button>
      </div>
      <Button
        size="lg"
        className="w-full bg-success hover:bg-success-hover"
        onClick={handleFinish}
      >
        <CheckCircle size={16} /> Finalizar
      </Button>
      {showToast && (
        <div className="fixed top-6 right-6 z-[999]">
          <div className="bg-success-tint border border-success/20 text-success px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
            <CheckCircle size={16} /> Contrato generado exitosamente
          </div>
        </div>
      )}
    </div>
  );
}

export { VistaPrevia };
