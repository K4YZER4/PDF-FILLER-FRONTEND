/** Stepper visual del flujo de contratos (4 pasos).
 *  - Mobile: solo iconos + número del paso actual, sin texto.
 *  - Desktop: icono + etiqueta completa.
 *  Solo permite navegar a pasos completados o al actual. */
import { CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Step {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface ContractStepperProps {
  steps: readonly Step[];
  currentIndex: number;
  onNavigate: (path: string) => void;
}

function ContractStepper({ steps, currentIndex, onNavigate }: ContractStepperProps) {
  return (
    <div className="flex items-center gap-1.5 md:gap-4 min-w-0">
      {steps.map((step, i) => {
        const isCurrent = i === currentIndex;
        const isCompleted = i < currentIndex;

        return (
          <button
            key={step.path}
            onClick={() => {
              if (isCompleted || isCurrent) onNavigate(step.path);
            }}
            disabled={!isCompleted && !isCurrent}
            aria-current={isCurrent ? "step" : undefined}
            className={`
              flex-1 flex items-center justify-center md:justify-start gap-1 md:gap-2
              p-1.5 md:p-3 rounded-lg transition-all min-w-0
              ${isCurrent ? "bg-primary-tint text-primary" : ""}
              ${isCompleted ? "bg-success-tint text-success" : ""}
              ${!isCurrent && !isCompleted ? "bg-stone-100 text-text-secondary cursor-not-allowed opacity-60" : ""}
            `}
          >
            <div
              className={`
                w-7 h-7 md:w-8 md:h-8 rounded-full
                flex items-center justify-center shrink-0
                ${isCurrent ? "bg-primary text-white" : ""}
                ${isCompleted ? "bg-success text-white" : ""}
                ${!isCurrent && !isCompleted ? "bg-stone-200" : ""}
              `}
            >
              {isCompleted ? (
                <CheckCircle size={14} aria-hidden="true" />
              ) : (
                <step.icon size={14} aria-hidden="true" />
              )}
            </div>
            <span className="hidden md:inline text-xs font-medium truncate text-left leading-tight">
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { ContractStepper };
