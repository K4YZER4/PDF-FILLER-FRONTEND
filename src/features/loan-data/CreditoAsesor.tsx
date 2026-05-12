/** Paso 3 del flujo: Datos del préstamo (monto y plazo).
 *  - Selección de monto neto (input numérico).
 *  - Selección de plazo en quincenas (botones: 24, 36, 48, 72, 96, 120).
 *  - Botón "Calcular" que simula un cálculo y muestra resultados (monto pagaré, descuento, tasa, CAT).
 *  - Tarjeta de resumen con datos del cliente, monto y plazo.
 *  - handleConfirm guarda el resultado en el store para que el stepper pueda avanzar. */
import { useState } from "react";
import { TrendingUp, FileDown } from "lucide-react";

import { Button, Input } from "@/components/ui";
import { Card } from "@/components";
import { useContractStore } from "@/store/useContractStore";

function CreditoAsesor() {
  const store = useContractStore();
  const [monto, setMonto] = useState("");
  const [plazo, setPlazo] = useState(48);
  const [isCalculando, setIsCalculando] = useState(false);
  const [resultado, setResultado] = useState<{
    montoPagare: number;
    descuentoQuincenal: number;
    tasaMensual: number;
    cat: number;
  } | null>(null);

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

  const calcular = async () => {
    if (!monto || Number(monto) <= 0) return;
    setIsCalculando(true);
    await new Promise((r) => setTimeout(r, 1000));
    const m = Number(monto);
    setResultado({
      montoPagare: m * 1.15,
      descuentoQuincenal: (m * 1.15) / plazo,
      tasaMensual: 0.025,
      cat: 0.32,
    });
    setIsCalculando(false);
  };

  const handleConfirm = () => {
    if (resultado) store.setFormData("tabla", resultado);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Datos del Préstamo
        </h2>
        <p className="text-sm text-text-secondary">
          Configura los términos del crédito
        </p>
      </div>
      <Card className="p-5 md:p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Monto neto (capital)
          </label>
          <Input
            placeholder="Ej: 15000"
            value={monto}
            type="number"
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-text-secondary">
            Plazo (quincenas)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[24, 36, 48, 72, 96, 120].map((q) => (
              <button
                key={q}
                onClick={() => setPlazo(q)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${plazo === q ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-border hover:border-primary"}`}
              >
                {q} QNAs
              </button>
            ))}
          </div>
        </div>
        <Button
          onClick={calcular}
          loading={isCalculando}
          disabled={!monto || Number(monto) <= 0}
          size="lg"
        >
          <TrendingUp size={16} /> Calcular
        </Button>
        {resultado && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Monto pagaré",
                value: `$${resultado.montoPagare.toLocaleString()}`,
              },
              {
                label: "Descuento quincenal",
                value: `$${resultado.descuentoQuincenal.toLocaleString()}`,
              },
              {
                label: "Tasa mensual",
                value: `${(resultado.tasaMensual * 100).toFixed(1)}%`,
              },
              {
                label: "CAT anual",
                value: `${(resultado.cat * 100).toFixed(1)}%`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-bg border border-border rounded-lg p-4"
              >
                <div className="text-xs text-text-secondary mb-1">
                  {item.label}
                </div>
                <div className="text-lg font-semibold text-primary">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card className="p-5 md:p-6 space-y-3">
        <h3 className="text-sm font-semibold text-text-primary">Resumen</h3>
        {[
          { label: "Cliente", value: clientName },
          { label: "Monto", value: `$${Number(monto || 0).toLocaleString()}` },
          { label: "Plazo", value: `${plazo} QNAs` },
        ].map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary">{item.value}</span>
          </div>
        ))}
      </Card>
      <Button
        size="lg"
        className="w-full bg-success hover:bg-success-hover"
        onClick={handleConfirm}
        disabled={!resultado}
      >
        <FileDown size={16} /> Generar Contrato PDF
      </Button>
    </div>
  );
}

export { CreditoAsesor };
