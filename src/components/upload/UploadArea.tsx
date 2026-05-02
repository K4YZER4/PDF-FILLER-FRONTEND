/**
 * Archivo: components/upload/UploadArea.tsx
 * Propósito: Área de carga de archivos con soporte para drag-and-drop.
 * Permite subir imágenes mediante clic o arrastrando archivos.
 */
import { useCallback, useState } from "react";
import { FileText } from "lucide-react";

interface UploadAreaProps {
  label: string; // Etiqueta que describe qué archivo se espera
  accept?: string; // Tipos de archivo aceptados (ej: "image/*")
  onFileSelect: (file: File) => void; // Callback cuando se selecciona un archivo
  file: File | null; // Archivo actualmente seleccionado
  fileName: string | null; // Nombre a mostrar del archivo
  placeholderIcon?: React.ReactNode; // Ícono opcional
  showFilename?: boolean; // Si mostrar el nombre del archivo
}

function UploadArea({
  label,
  accept = "image/*",
  onFileSelect,
  file,
  fileName,
  placeholderIcon,
  showFilename = true,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);

  /** Maneja el evento de soltar archivo */
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect],
  );

  /** Maneja cuando un archivo se arrastra sobre el área */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  /** Maneja cuando el archivo sale del área */
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  /** Maneja la selección mediante input file */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const hasFile = file !== null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
        {label}
      </span>
      {/* Área de carga con drag-and-drop */}
      <div
        className={`
           relative border-2 border-dashed rounded-lg min-h[110px] flex flex-col items-center justify-center
           cursor-pointer transition-colors text-center px-4
           ${hasFile ? "border-success bg-success-tint" : ""}
           ${isDragging ? "border-primary bg-primary-tint" : ""}
           ${!hasFile && !isDragging ? "border-stone-200 hover:border-primary hover:bg-primary-tint" : ""}
         `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {/* Input invisible que cubre toda el área */}
        <input
          type="file"
          accept={accept}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        {hasFile ? (
          // Muestra el nombre del archivo si ya se seleccionó uno
          showFilename ? (
            <span className="text-xs font-semibold text-success truncate max-w-37.5">
              {fileName || file.name}
            </span>
          ) : null
        ) : (
          // Muestra el placeholder si no hay archivo
          <>
            {placeholderIcon || (
              <FileText size={28} className="text-stone-300 mb-2" />
            )}
            <p className="text-xs font-medium text-stone-500">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}

export { UploadArea };
export type { UploadAreaProps };
