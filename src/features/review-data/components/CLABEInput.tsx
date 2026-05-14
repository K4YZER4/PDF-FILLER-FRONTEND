/** Input para CLABE interbancaria (18 dígitos).
 *  Valida el dígito verificador con algoritmo BANXICO al completar. */
import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

function validateCLABE(clabe: string): boolean {
  if (clabe.length !== 18 || !/^\d{18}$/.test(clabe)) return false;

  // Los pesos se aplican sobre los primeros 17 dígitos
  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

  const sum = weights.reduce((acc, w, i) => {
    // Suma el residuo de (dígito × peso) / 10
    return acc + ((parseInt(clabe[i]) * w) % 10);
  }, 0);

  // El dígito verificador es (10 - (suma % 10)) % 10
  const expected = (10 - (sum % 10)) % 10;

  // Se compara contra el dígito 18 (índice 17)
  return expected === parseInt(clabe[17]);
}
type CLABEInputProps = Omit<InputProps, "onChange"> & {
  onChange?: (value: string) => void;
};

const CLABEInput = forwardRef<HTMLInputElement, CLABEInputProps>(
  ({ onChange, value, error, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/\D/g, "").slice(0, 18);
      onChange?.(cleaned);
    };

    const currentLength = String(value ?? "").length;
    const clabeError =
      currentLength === 18 && !validateCLABE(String(value))
        ? "CLABE inválida — verifica los 18 dígitos"
        : undefined;

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={18}
        value={value}
        onChange={handleChange}
        error={error ?? clabeError}
        hint={!error && !clabeError ? `${currentLength}/18 dígitos` : undefined}
        {...props}
      />
    );
  },
);

CLABEInput.displayName = "CLABEInput";
export { CLABEInput };
