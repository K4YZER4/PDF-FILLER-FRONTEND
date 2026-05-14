/** Input para nombres y apellidos.
 *  Solo acepta letras, espacios, acentos y Ñ.
 *  Convierte a mayúsculas automáticamente.
 *  maxLength se pasa desde el padre (por defecto 60). */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

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
        {...props} // maxLength ya no viene aquí porque lo extrajiste arriba
      />
    );
  },
);

NameInput.displayName = "NameInput";
export { NameInput };
