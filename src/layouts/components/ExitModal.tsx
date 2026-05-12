/** Modal de confirmación para salir del flujo de contrato.
 *  Aparece al presionar "Salir" en el header o "Cancelar" en el paso 1.
 *  Descarta todos los datos del contrato en progreso.
 *  Clic en el overlay fuera de la tarjeta también cancela. */
import { Button } from "@/components/ui";

interface ExitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ExitModal({ onConfirm, onCancel }: ExitModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
      aria-describedby="exit-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Tarjeta */}
      <div className="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="exit-modal-title" className="text-base font-semibold text-text-primary">
            ¿Salir del contrato?
          </h2>
          <p id="exit-modal-desc" className="text-sm text-text-secondary leading-relaxed">
            Si sales ahora, los datos que ingresaste no se guardarán y tendrás que empezar de nuevo.
          </p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Seguir editando
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm}>
            Salir sin guardar
          </Button>
        </div>
      </div>
    </div>
  );
}

export { ExitModal };
