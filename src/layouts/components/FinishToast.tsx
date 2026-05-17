/** Toast de notificación que indica que el contrato se generó exitosamente.
 *  Aparece al finalizar el contrato y se oculta automáticamente tras 2 segundos. */
import { CheckCircle } from "lucide-react";

interface FinishToastProps {
  show: boolean;
}

function FinishToast({ show }: FinishToastProps) {
  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-999 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-success-tint border border-success/20 text-success px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm">
        <CheckCircle size={16} /> Contrato generado exitosamente
      </div>
    </div>
  );
}

export { FinishToast };
