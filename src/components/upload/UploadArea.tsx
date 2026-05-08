/**
 * Archivo: components/upload/UploadArea.tsx
 * Propósito: Área de carga de archivos con drag & drop.
 */
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui"

interface UploadAreaProps {
  label: string
  accept?: string
  onFileSelect: (file: File) => void
  file: File | null
  fileName?: string | null
  showFilename?: boolean
}

function UploadArea({ label, accept, onFileSelect, file, showFilename }: UploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) onFileSelect(f)
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-stone-600 block">{label}</label>
      {file ? (
        <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
          <FileText size={16} className="text-primary" />
          {showFilename && (
            <span className="text-xs text-stone-700 flex-1 truncate">{file.name}</span>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onFileSelect(null as any)}
            className="p-1 h-auto"
          >
            <X size={12} />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
          <Upload size={20} className="text-stone-400 mb-2" />
          <span className="text-xs text-stone-500">Haz clic o arrastra un archivo</span>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" />
        </label>
      )}
    </div>
  )
}

export { UploadArea }
