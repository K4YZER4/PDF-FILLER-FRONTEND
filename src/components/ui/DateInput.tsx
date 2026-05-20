/** Input de fecha con calendario nativo del navegador.
 *  Rango válido: 1935-01-01 a (hoy - 18 años).
 *
 *  Props:
 *    onChange: (isoValue: string) => void  →  "YYYY-MM-DD" */
import { forwardRef } from "react";
import { Input, type InputProps } from "./Input";

const MAX_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  .toISOString()
  .split("T")[0];

type DateInputProps = Omit<InputProps, "onChange" | "type"> & {
  onChange?: (isoValue: string) => void;
  /** Sobreescribe el max por defecto (hoy - 18 años). Formato: YYYY-MM-DD */
  maxDate?: string;
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ onChange, maxDate, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min="1935-01-01"
        max={maxDate ?? MAX_DATE}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
export { DateInput };
