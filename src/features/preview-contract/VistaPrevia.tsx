/** Paso 4 del flujo: Vista previa del contrato antes de finalizar.
 *  - Muestra una simulación visual del PDF (contenido placeholder).
 *  - Las acciones (descargar, editar, finalizar) están en el footer del layout.
 *  - Botón flotante "Compartir" en el layout (compartir vía Web Share API). */
import { Card } from "@/components";

function VistaPrevia() {
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
    </div>
  );
}

export { VistaPrevia };