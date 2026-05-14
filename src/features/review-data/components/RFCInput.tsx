/**
 * ──────────────────────────────────────────────────────────────────────────────
 * RFCInput.tsx  —  Input para RFC de persona física (13 caracteres)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input> que solo acepta letras (incluyendo Ñ y &), números,
 *   máximo 13 caracteres, y convierte todo a mayúsculas.
 *   Al completar los 13 caracteres valida el formato básico del RFC.
 *
 * Formato RFC (persona física):
 *   [A-ZÑ&]{4}  →  4 letras derivadas del nombre (apellido paterno, vocal
 *                    interna del paterno, apellido materno, nombre)
 *   \d{6}       →  6 dígitos de la fecha de nacimiento (YYMMDD)
 *   [A-Z0-9]{3} →  3 caracteres alfanuméricos (homoclave asignada por el SAT)
 *
 * La validación del RFC es compleja (incluye homonimia, palabras
 * inconvenientes, etc.) pero aquí solo hacemos una validación
 * estructural básica. La validación definitiva la hace el SAT.
 *
 * Props:
 *   value, error  →  Del padre
 *   onChange: (value: string) => void
 *
 * Nota sobre el error:
 *   Si el padre ya reportó error (ej: "Obligatorio"), se muestra ese.
 *   Al llegar a 13 caracteres se valida formato. Si no corresponde,
 *   muestra "Formato de RFC inválido".
 *
 * Diferencia con CURP:
 *   RFC y CURP comparten los primeros 13 caracteres (RFC es la base de la CURP),
 *   pero CURP agrega 5 caracteres adicionales (entidad + homonimia + dígito).
 *   Por eso ambos inputs son similares pero con diferente regex y maxLength.
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

/**
 * Regex estructural del RFC para persona física (13 caracteres).
 * No valida palabras inconvenientes ni homonimia — eso lo hace el SAT.
 */
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
        hint={!error && !rfcError ? `${currentLength}/13 caracteres` : undefined}
        {...props}
      />
    );
  },
);

RFCInput.displayName = "RFCInput";
export { RFCInput };
