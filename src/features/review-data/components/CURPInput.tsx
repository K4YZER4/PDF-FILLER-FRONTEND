/** Input para CURP mexicana (18 caracteres).
 *  Acepta letras y números, convierte a mayúsculas.
 *  Valida formato oficial al completar los 18 caracteres. */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;

type CURPInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const CURPInput = forwardRef<HTMLInputElement, CURPInputProps>(
  ({ onChange, value, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .slice(0, 18);
      onChange?.(cleaned);
    };

    const currentLength = String(value ?? "").length;
    const formatError =
      currentLength === 18 && !CURP_REGEX.test(String(value))
        ? "Formato de CURP inválido"
        : undefined;

    return (
      <Input
        ref={ref}
        type="text"
        maxLength={18}
        value={value}
        autoCapitalize="characters"
        autoCorrect="off"
        spellCheck={false}
        onChange={handleChange}
        error={error ?? formatError}
        hint={!error && !formatError ? `${currentLength}/18 caracteres` : undefined}
        {...props}
      />
    );
  },
);

CURPInput.displayName = "CURPInput";
export { CURPInput };
