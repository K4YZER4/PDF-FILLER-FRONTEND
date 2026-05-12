// Componente de estado vacío para mostrar cuando no hay datos disponibles

import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  image?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

function EmptyState({
  title,
  description,
  image,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        min-h-[70vh]
        text-center
      "
    >
      {/* Imagen o icono */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="
            w-full
            max-w-md
            object-contain
          "
        />
      ) : (
        icon && <div className="mb-6">{icon}</div>
      )}

      {/* Título */}
      <h2
        className="
          mt-8
          text-3xl
          font-bold
          text-text-primary
        "
      >
        {title}
      </h2>

      {/* Descripción */}
      {description && (
        <p
          className="
            mt-3
            max-w-md
            text-sm
            leading-relaxed
            text-text-secondary
          "
        >
          {description}
        </p>
      )}

      {/* Acción */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            btn-primary
            mt-8
            min-w-56
          "
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { EmptyState };
