/**
 * Mapea un LoanFieldDef al componente de input correspondiente.
 *
 * Cada tipo de campo ("name", "numeric", "date", "email", "select") se traduce
 * al componente UI especializado (NameInput, NumericInput, etc.) con las props
 * compartidas (id, inputSize, required, success, error, placeholder, value).
 *
 * Uso:
 *   import { renderLoanField } from "./utils/fieldRenderer";
 *   renderLoanField(field, value, isFilled, onUpdate, error);
 */

import { Input, NameInput, NumericInput, DateInput } from "@/components/ui"
import { SelectField } from "../components/SelectField"
import type { LoanFieldDef } from "../constants"

export function renderLoanField(
  field: LoanFieldDef,
  value: string,
  isFilled: boolean,
  onUpdate: (value: string) => void,
  error?: string,
): React.ReactElement {
  const shared = {
    id: field.id,
    inputSize: "sm" as const,
    required: true,
    success: isFilled,
    error,
    placeholder: field.placeholder,
    value,
  }

  switch (field.type) {
    case "name":
      return <NameInput {...shared} maxLength={field.maxLength ?? 40} onChange={onUpdate} />
    case "numeric":
      return <NumericInput {...shared} maxLength={field.maxLength} onChange={onUpdate} />
    case "date":
      return <DateInput {...shared} onChange={onUpdate} />
    case "email":
      return <Input {...shared} type="email" onChange={(e) => onUpdate(e.target.value)} />
    case "select":
      return (
        <SelectField
          id={field.id}
          value={value}
          options={field.selectOptions ?? []}
          placeholder={field.placeholder}
          success={isFilled}
          error={error}
          onChange={onUpdate}
        />
      )
  }
}
