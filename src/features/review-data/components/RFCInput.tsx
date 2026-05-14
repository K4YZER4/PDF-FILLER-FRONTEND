/** Input para RFC de persona física (13 caracteres).
 *  Acepta letras y números, convierte a mayúsculas.
 *  Valida formato básico al completar los 13 caracteres. */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

// 4 letras (nombre+apellidos) + 6 dígitos (fecha) + 3 alfanuméricos (homoclave)
const RFC_REGEX = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;

type RFCInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const RFCInput = forwardRef<HTMLInputElement, RFCInputProps>(
  ({ onChange, value, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value
        .replace(/[^a-zA-Z0-9Ñ&]/g, "")
        .toUpperCase()
        .slice(0, 13);
      onChange?.(cleaned);
    };

    const currentLength = String(value ?? "").length;
    const rfcError =
      currentLength === 13 && !RFC_REGEX.test(String(value))
        ? "Formato de RFC inválido"
        : undefined;

    return (
      <Input
        ref={ref}
        type="text"
        maxLength={13}
        value={value}
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        onChange={handleChange}
        error={error ?? rfcError}
        hint={
          !error && !rfcError ? `${currentLength}/13 caracteres` : undefined
        }
        {...props}
      />
    );
  },
);

RFCInput.displayName = "RFCInput";
export { RFCInput };
