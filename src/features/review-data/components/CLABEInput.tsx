/**
 * ──────────────────────────────────────────────────────────────────────────────
 * CLABEInput.tsx  —  Input para CLABE interbancaria (18 dígitos)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input> que solo acepta 18 dígitos numéricos.
 *   Al completar los 18 dígitos valida el dígito verificador usando
 *   el algoritmo de BANXICO (mismo que usan los bancos en México).
 *
 * ¿Qué es la CLABE?
 *   Clave Bancaria Estandarizada — 18 dígitos que identifican de forma única
 *   una cuenta bancaria en México. Estructura:
 *     - Posiciones 1-3:  Código del banco (catálogo ABM)
 *     - Posiciones 4-7:  Sucursal
 *     - Posiciones 8-17: Número de cuenta (10 dígitos)
 *     - Posición 18:     Dígito verificador (algoritmo BANXICO)
 *
 * Algoritmo de validación:
 *   Se toman los primeros 17 dígitos, cada uno se multiplica por un peso
 *   (3, 7, 1, 3, 7, 1, …). Se suman los residuos de (dígito × peso) % 10.
 *   El dígito verificador esperado es (10 - (suma % 10)) % 10.
 *   Si coincide con el dígito 18, la CLABE es válida.
 *
 * Props:
 *   value, error  →  Del padre
 *   onChange: (value: string) => void
 *
 * Nota sobre el error:
 *   Si el padre ya reportó error (ej: "Obligatorio"), se muestra ese.
 *   Solo al tener exactamente 18 dígitos se ejecuta la validación
 *   del dígito verificador. Si falla, se muestra "CLABE inválida".
 *
 * ¿Por qué es útil la validación aquí?
 *   Porque escribir 18 dígitos al azar casi nunca pasa el checksum.
 *   El usuario se da cuenta inmediatamente si transcribe mal un dígito.
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

/**
 * Valida el dígito verificador de una CLABE usando el algoritmo BANXICO.
 * Los pesos se aplican sobre los primeros 17 dígitos y el resultado
 * se compara contra el dígito 18.
 */
function validateCLABE(clabe: string): boolean {
  if (clabe.length !== 18 || !/^\d{18}$/.test(clabe)) return false;

  const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];

  const sum = weights.reduce((acc, w, i) => {
    return acc + ((parseInt(clabe[i]) * w) % 10);
  }, 0);

  const expected = (10 - (sum % 10)) % 10;
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
