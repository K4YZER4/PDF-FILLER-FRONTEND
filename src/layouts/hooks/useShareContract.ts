/** Hook para la lógica de compartir contrato vía Web Share API o portapapeles.
 *  Extraído de ContractLayout.tsx para mantener el layout enfocado en orquestación.
 *
 *  Usa la Web Share API del navegador si está disponible,
 *  o copia la información al portapapeles como fallback.
 *
 *  Uso:
 *    const handleShare = useShareContract(); */
import { useCallback } from "react";
import { useClientName } from "@/store/selectors";
import { useContractStore } from "@/store/useContractStore";

export function useShareContract(): () => Promise<void> {
  const clientName = useClientName();
  const montoPagare = useContractStore((s) => s.formData.tabla?.montoPagare);

  return useCallback(async () => {
    const monto = montoPagare ?? 0;
    const text = `Contrato CREDIFOM\nCliente: ${clientName}\nMonto: $${monto.toLocaleString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Contrato CREDIFOM", text });
      } catch {
        /* usuario canceló */
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Información copiada al portapapeles");
    }
  }, [clientName, montoPagare]);
}
