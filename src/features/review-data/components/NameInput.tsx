/**
 * ──────────────────────────────────────────────────────────────────────────────
 * NameInput.tsx  —  Input especializado para nombres y apellidos
 * ──────────────────────────────────────────────────────────────────────────────
 *
 * ¿Qué hace?
 *   Renderiza un <input> que SOLO acepta letras (incluyendo acentos y Ñ),
 *   espacios y convierte todo a MAYÚSCULAS automáticamente.
 *   Ideal para campos como: nombre, apellido, municipio, estado, calle, etc.
 *
 * Validaciones / transformaciones:
 *   - Elimina cualquier carácter que NO sea letra, espacio, acento o Ñ
 *   - Convierte a mayúsculas
 *   - Corta en `maxLength` (se recibe del padre; default 60)
 *   - Solo muestra caracteres permitidos (números, símbolos, etc. se descartan)
 *
 * Props que recibe (además de InputProps):
 *   onChange: (value: string) => void   →  Devuelve el string ya limpio
 *   maxLength?: number                  →  Límite de caracteres (default 60)
 *
 * ¿Por qué extiende InputProps en lugar de usar Input directamente?
 *   Para que RevisionDatos pueda pasar cualquier prop del Input base
 *   (id, placeholder, value, success, error, etc.) sin intermediarios.
 *   La unica diferencia es que onChange recibe string en lugar de ChangeEvent.
 *
 * Uso en RevisionDatos:
 *   <NameInput {...shared} maxLength={60} onChange={(v) => update(..., v)} />
 *   ─────────────────────────────────────────────────────────────────────
 */

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
        {...props}
      />
    );
  },
);

NameInput.displayName = "NameInput";
export { NameInput };
