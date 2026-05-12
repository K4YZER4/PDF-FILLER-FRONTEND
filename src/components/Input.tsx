/** Input de texto reutilizable con soporte para mensaje de error.
 *  Muestra un span con el error debajo del input si la prop error está definida. */
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5">
        <input
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 text-sm rounded-md border border-border bg-white transition-all placeholder:text-text-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 ${error ? "border-error" : ""} ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
