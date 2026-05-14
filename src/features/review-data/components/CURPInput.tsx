/**
 * ──────────────────────────────────────────────────────────────────────────────
 * CURPInput.tsx  —  Input especializado para CURP mexicana (18 caracteres)
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input> que solo acepta letras y números, máximo 18 caracteres,
 *   y convierte todo a mayúsculas. Al completar los 18 caracteres valida el
 *   formato oficial de la CURP contra el regex estándar del SAT/INEGI.
 *
 * Formato CURP (persona física):
 *   [A-Z]{4}  →  Primera letra del apellido paterno, primera vocal interna del
 *                 apellido paterno, primera letra del apellido materno y primera
 *                 letra del nombre
 *   \d{6}     →  Fecha de nacimiento (año, mes, día)
 *   [HM]      →  Sexo (H = Hombre, M = Mujer)
 *   [A-Z]{5}  →  Dos letras de la entidad federativa, tres consonantes internas
 *   [A-Z0-9]  →  Diferenciador de homonimia
 *   \d        →  Dígito verificador
 *
 * Props relevantes:
 *   value, error  →  Se usan del padre (RevisionDatos)
 *   onChange: (value: string) => void
 *
 * Nota sobre el error:
 *   Si el padre ya pasó un error (campo vacío), se muestra ese (ej: "Obligatorio").
 *   Solo cuando el padre no reporta error y hay 18 caracteres, se valida el formato.
 */

import { forwardRef } from "react";
import { Input, type InputProps } from "@/components/ui";

/**
 * Regex de CURP según especificación del SAT.
 *   - 4 letras mayúsculas (incluye Ñ)
 *   - 6 dígitos (fecha)
 *   - H o M (sexo)
 *   - 5 letras mayúsculas
 *   - 1 letra o dígito
 *   - 1 dígito (verificador)
 */
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
