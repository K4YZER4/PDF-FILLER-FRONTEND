/** Botón flotante de compartir — visible solo en móvil durante el paso de vista previa.
 *  Aparece como un FAB (Floating Action Button) en la esquina inferior derecha. */
import { Share2 } from "lucide-react";

interface FloatingShareButtonProps {
  onShare: () => void;
}

function FloatingShareButton({ onShare }: FloatingShareButtonProps) {
  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Compartir contrato"
      className="md:hidden fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary-hover transition-all active:scale-95"
    >
      <Share2 size={22} />
    </button>
  );
}

export { FloatingShareButton };
