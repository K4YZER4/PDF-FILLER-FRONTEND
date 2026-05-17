/** Input que solo acepta dígitos numéricos.
 *  Usa inputMode="numeric" para abrir el teclado numérico en móvil.
 *
 *  Props:
 *    maxLength?: number
 *    onChange: (value: string) => void */
import { forwardRef } from "react";
import { Input, type InputProps } from "./Input";

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
        step={1}
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
