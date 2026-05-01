/**
 * Archivo: components/upload/ImagePreview.tsx
 * Propósito: Previsualización de imagen con opción de reemplazar al pasar el mouse.
 * Muestra la imagen cargada y permite cambiarla con un clic.
 */
interface ImagePreviewProps {
  src: string                 // URL de la imagen a mostrar
  alt: string                 // Texto alternativo
  onReplace?: () => void     // Callback para reemplazar la imagen
}

function ImagePreview({ src, alt, onReplace }: ImagePreviewProps) {
  return (
    <div className="relative rounded-md overflow-hidden group">
      <img
        src={src}
        alt={alt}
        className="w-full max-h-[180px] object-contain rounded-md"
        loading="lazy"
      />
      {/* Overlay que aparece al pasar el mouse para cambiar la imagen */}
      {onReplace && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <span className="text-white text-xs font-medium">Clic para cambiar</span>
        </div>
      )}
    </div>
  )
}

export { ImagePreview }
export type { ImagePreviewProps }
