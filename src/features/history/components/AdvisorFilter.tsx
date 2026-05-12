/**
 * Select desplegable para filtrar contratos por asesor.
 *  - Muestra "Todos los asesores" por defecto.
 *  - Dropdown custom estilizable (no usa select nativo).
 *  - Solo visible para administradores.
 */
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Users, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface AdvisorFilterProps {
  /** Asesor seleccionado actualmente */
  value: string;

  /** Callback cuando cambia la selección */
  onChange: (v: string) => void;

  /** Lista de asesores */
  advisors: string[];
}

function AdvisorFilter({ value, onChange, advisors }: AdvisorFilterProps) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative ml-auto w-fit min-w-30 sm:min-w-55"
    >
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          // Tamaño similar al TimeFilter
          "h-9 px-3 rounded-lg border",

          // Layout
          "w-full flex items-center justify-between gap-2",

          // Tipografía
          "text-sm font-medium",

          // Colores
          "bg-surface border-border text-text-primary",

          // Animaciones
          "transition-all duration-150",

          // Hover
          "hover:bg-bg-dark hover:border-border-strong",

          // Focus
          "focus:outline-none focus:ring-2 focus:ring-primary/15",

          // Estado abierto
          open && "border-primary bg-primary-tint/40",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Users size={16} className="text-text-muted shrink-0" />

          {/* Mobile */}
          {!value && <span className="truncate sm:hidden">Todos</span>}

          {/* Desktop */}
          {!value && (
            <span className="truncate hidden sm:inline">
              Todos los asesores
            </span>
          )}

          {/* Asesor seleccionado */}
          {value && <span className="truncate">{value}</span>}
        </div>

        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-text-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute top-[calc(100%+6px)] left-0 z-50",
            "w-full overflow-hidden",

            // Dropdown más parecido a Figma
            "rounded-xl border border-border",

            "bg-surface shadow-lg",
          )}
        >
          {/* Opción todos */}
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "w-full px-3 py-2.5",
              "flex items-center justify-between",
              "text-left text-sm font-medium",
              "transition-colors",

              value === ""
                ? "bg-primary text-white"
                : "text-text-primary hover:bg-primary-tint",
            )}
          >
            Todos los asesores
            {value === "" && <Check size={15} />}
          </button>

          {/* Asesores */}
          {advisors.map((advisor) => {
            const selected = advisor === value;

            return (
              <button
                key={advisor}
                type="button"
                onClick={() => {
                  onChange(advisor);
                  setOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2.5",
                  "flex items-center justify-between",
                  "text-left text-sm",
                  "transition-colors",

                  selected
                    ? "bg-primary text-white font-medium"
                    : "text-text-primary hover:bg-primary-tint",
                )}
              >
                <span className="truncate">{advisor}</span>

                {selected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { AdvisorFilter };
