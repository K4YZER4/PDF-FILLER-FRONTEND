/** Input que solo acepta dígitos numéricos.
 *  inputMode="numeric" abre teclado numérico en móvil.
 *  Acepta maxLength para limitar la longitud (CP=5, No.Ext=6, etc.). */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

type NumericInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ onChange, maxLength, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/\D/g, "");
      const limited = maxLength ? cleaned.slice(0, maxLength) : cleaned;
      onChange?.(limited);
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoCorrect="off"
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

NumericInput.displayName = "NumericInput";
export { NumericInput };
