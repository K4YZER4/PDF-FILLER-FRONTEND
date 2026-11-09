import { Input, NameInput, NumericInput, DateInput } from "@/components/ui";
import { SelectField } from "./SelectField";
import type { AsesorData } from "../types";
import type { AsesorApiItem } from "../api/asesores.api";

interface AsesorSectionProps {
  data: AsesorData;
  userRole: string | null;
  asesoresList: AsesorApiItem[];
  onChange: <K extends keyof AsesorData>(key: K, value: AsesorData[K]) => void;
}

const readOnlyClass = "bg-bg cursor-default";

function AsesorSection({ data, userRole, asesoresList, onChange }: AsesorSectionProps) {
  const asesorNombres = asesoresList.map(a => a.nombre);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-medium text-text-secondary">
          Asesor <span className="text-error">*</span>
        </label>
        {userRole === "admin" ? (
          <SelectField
            id="asesor"
            value={data.asesor}
            options={asesorNombres}
            placeholder="Seleccionar asesor"
            success={(data.asesor?.trim()?.length ?? 0) > 0}
            onChange={(v) => onChange("asesor", v)}
          />
        ) : (
          <Input
            id="asesor"
            value={data.asesor}
            disabled
            inputSize="sm"
            success={data.asesor.length > 0}
            className="text-text-primary"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Folio <span className="text-error">*</span>
        </label>
        <NumericInput
          id="folio"
          placeholder="00000"
          value={data.folio}
          maxLength={5}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.folio?.length ?? 0) === 5}
          onChange={(v) => onChange("folio", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Sucursal <span className="text-error">*</span>
        </label>
        <NameInput
          id="sucursal"
          placeholder="Nombre de la sucursal"
          value={data.sucursal}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.sucursal?.trim()?.length ?? 0) > 0}
          onChange={(v) => onChange("sucursal", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Num. Vendedor <span className="text-error">*</span>
        </label>
        <Input
          id="numVendedor"
          placeholder="ASE001"
          value={data.numVendedor}
          maxLength={6}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.numVendedor?.length ?? 0) === 6}
          onChange={(e) => onChange("numVendedor", e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha Contrato <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaContrato"
          value={data.fechaContrato}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.fechaContrato?.length ?? 0) > 0}
          onChange={(v) => onChange("fechaContrato", v)}
        />
      </div>
    </div>
  );
}

export { AsesorSection };
