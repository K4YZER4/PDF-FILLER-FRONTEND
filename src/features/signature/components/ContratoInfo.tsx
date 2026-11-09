/** Muestra los datos del contrato que el cliente va a firmar.
 *
 *  Renderiza folio, nombre completo, CURP, importe del crédito,
 *  importe total y pago quincenal en una card resumen.
 *
 *  Uso:
 *    <ContratoInfo contrato={data.contrato} /> */
import { Card } from "@/components";
import type { SignatureContractData } from "../types";

interface ContratoInfoProps {
  contrato: SignatureContractData;
}

function ContratoInfo({ contrato }: ContratoInfoProps) {
  const items = [
    { label: "Folio", value: contrato.folio },
    { label: "Nombre", value: contrato.nombre },
    { label: "CURP", value: contrato.curp },
    { label: "Importe del crédito", value: `$${Number(contrato.importeCredito).toLocaleString("es-MX")}` },
    { label: "Importe total", value: `$${Number(contrato.importeTotal).toLocaleString("es-MX")}` },
    { label: "Pago quincenal", value: `$${Number(contrato.pagoQuincenal).toLocaleString("es-MX")}` },
  ];

  return (
    <Card className="p-5 space-y-3 border-2 border-border">
      <h3 className="text-base font-semibold text-text-primary">
        Resumen del Contrato
      </h3>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex justify-between py-2 text-sm"
          >
            <span className="text-text-secondary">{item.label}</span>
            <span className="font-medium text-text-primary text-right ml-4">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { ContratoInfo };
