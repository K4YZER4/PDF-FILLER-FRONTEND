/** Mapeador de tipos de campo a componentes de input.
 *  Extraído de RevisionDatos.tsx para mantener el componente
 *  enfocado en orquestación y layout.
 *
 *  renderField recibe las props compartidas y el handler de actualización,
 *  y devuelve el componente especializado correspondiente según field.id.
 *
 *  Uso:
 *    import { renderField } from "./utils/fieldRenderer"; */
import type { FieldDef } from "@/constants/revisionFields";
import { Input, NameInput, NumericInput, DateInput } from "@/components/ui";
import {
  CURPInput,
  SexSelect,
  CLABEInput,
  RFCInput,
} from "@/features/review-data/components";

/** Renderiza el input correcto según el tipo de campo.
 *  Props compartidas se pasan con spread para no repetirlas en cada case. */
export function renderField(
  field: FieldDef,
  val: string,
  isFilled: boolean,
  onUpdate: (value: string) => void,
): React.ReactElement {
  const shared = {
    id: field.id,
    inputSize: "sm" as const,
    required: true,
    success: isFilled,
    error: !isFilled ? "Obligatorio" : undefined,
    placeholder: field.placeholder,
    value: val,
  };

  switch (field.id) {
    // Nombres y apellidos — solo letras, mayúsculas, máximo 40 caracteres
    case "primerNombre":
    case "segundoNombre":
    case "primerApellido":
    case "segundoApellido":
    // Campos de dirección — mismas reglas que nombres
    case "calle":
    case "colonia":
    case "municipio":
    case "estado":
    // Banco — nombre de institución bancaria
    case "banco":
      return <NameInput {...shared} maxLength={40} onChange={onUpdate} />;

    // Campos laborales — nombres de instituciones, más largos
    case "dependencia":
    case "departamento":
    case "puesto":
      return <NameInput {...shared} maxLength={40} onChange={onUpdate} />;

    case "curp":
      return <CURPInput {...shared} onChange={onUpdate} />;

    case "sexo":
      return (
        <SexSelect
          id={field.id}
          value={val}
          required
          error={!isFilled ? "Obligatorio" : undefined}
          onChange={onUpdate}
        />
      );

    case "fechaNacimiento":
      return <DateInput {...shared} onChange={onUpdate} />;

    case "codigoPostal":
      return <NumericInput {...shared} maxLength={5} onChange={onUpdate} />;

    case "noExt":
      return <NumericInput {...shared} maxLength={6} onChange={onUpdate} />;

    case "noCuenta":
    case "noEmpleado":
      return <NumericInput {...shared} maxLength={10} onChange={onUpdate} />;

    case "ingresoMensual":
      return <NumericInput {...shared} maxLength={10} onChange={onUpdate} />;

    case "rfc":
      return <RFCInput {...shared} onChange={onUpdate} />;

    case "clabe":
      return <CLABEInput {...shared} onChange={onUpdate} />;

    case "claveElector":
      return <Input {...shared} maxLength={18} onChange={(e) => onUpdate(e.target.value)} />;

    default:
      return <Input {...shared} onChange={(e) => onUpdate(e.target.value)} />;
  }
}
