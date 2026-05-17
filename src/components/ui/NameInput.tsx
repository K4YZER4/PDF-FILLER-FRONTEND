/** Input especializado para nombres y apellidos.
 *  Solo acepta letras (incluyendo acentos y Ñ), espacios
 *  y convierte todo a MAYÚSCULAS automáticamente.
 *
 *  Props:
 *    onChange: (value: string) => void
 *    maxLength?: number (default 60) */
import { forwardRef } from "react";
import { Input, type InputProps } from "./Input";

type NameInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const NameInput = forwardRef<HTMLInputElement, NameInputProps>(
  ({ onChange, maxLength = 60, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "")
        .toUpperCase()
        .slice(0, maxLength);
      onChange?.(cleaned);
    };

    return (
      <Input
        ref={ref}
        type="text"
        autoCapitalize="characters"
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
    );
  },
);

NameInput.displayName = "NameInput";
export { NameInput };
