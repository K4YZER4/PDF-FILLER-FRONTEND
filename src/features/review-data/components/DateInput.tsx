/** Input de fecha con calendario nativo del navegador.
 *  Rango válido: 1935-01-01 a (hoy - 18 años). */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

type DateInputProps = Omit<InputProps, "onChange" | "type"> & {
  onChange?: (isoValue: string) => void;
};

const MAX_DATE = new Date(new Date().setFullYear(new Date().getFullYear() - 18))
  .toISOString()
  .split("T")[0];

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ onChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="date"
        min="1935-01-01"
        max={MAX_DATE}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
    );
  },
);

DateInput.displayName = "DateInput";
export { DateInput };
