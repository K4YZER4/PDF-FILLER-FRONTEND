/**
 * Archivo: features/loan-data/components/AsesorSection.tsx
 *
 * Sección 2 del accordion: datos del asesor.
 *
 * Comportamiento por rol:
 *   - Admin: selecciona un asesor del dropdown → todos los campos se autollenan
 *   - Asesor: todos los campos se autollenan con sus datos mock al montar
 *
 * Campos auto-rellenados (readOnly):
 *   - Folio, Sucursal, Núm. Vendedor, Asesor
 *   - Fecha Contrato (today), Lugar, Mes/Año Descuento
 *
 * Campos editables manualmente:
 *   - Fecha Arranque (selección manual por ahora)
 */
import { Input, NameInput, NumericInput, DateInput } from "@/components/ui";
import { SelectField } from "./SelectField";
import { ASESOR_NOMBRES, MESES } from "../constants";
import type { AsesorData } from "../types";

interface AsesorSectionProps {
  data: AsesorData;
  userRole: string | null;
  onChange: <K extends keyof AsesorData>(key: K, value: AsesorData[K]) => void;
}

const readOnlyClass = "bg-bg cursor-default";

function AsesorSection({
  data,
  userRole,
  onChange,
}: AsesorSectionProps) {
  const isAutoFilled = userRole !== "admin" || data.asesor.length > 0;

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
            options={ASESOR_NOMBRES}
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
          Núm. Vendedor <span className="text-error">*</span>
        </label>
        <NumericInput
          id="numVendedor"
          placeholder="000"
          value={data.numVendedor}
          maxLength={3}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.numVendedor?.length ?? 0) === 3}
          onChange={(v) => onChange("numVendedor", v)}
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

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha Arranque <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaArranque"
          value={data.fechaArranque}
          inputSize="sm"
          success={(data.fechaArranque?.length ?? 0) > 0}
          onChange={(v) => onChange("fechaArranque", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Lugar <span className="text-error">*</span>
        </label>
        <NameInput
          id="lugar"
          placeholder="Ciudad, Estado"
          value={data.lugar}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.lugar?.trim()?.length ?? 0) > 0}
          onChange={(v) => onChange("lugar", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Mes Descuento <span className="text-error">*</span>
        </label>
        <SelectField
          id="mesDescuento"
          value={data.mesDescuento}
          options={MESES}
          placeholder="Seleccionar mes"
          success={(data.mesDescuento?.length ?? 0) > 0}
          disabled={isAutoFilled}
          onChange={(v) => onChange("mesDescuento", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Año Descuento <span className="text-error">*</span>
        </label>
        <NumericInput
          id="anioDescuento"
          placeholder="0000"
          value={data.anioDescuento}
          maxLength={4}
          inputSize="sm"
          readOnly
          className={readOnlyClass}
          success={(data.anioDescuento?.length ?? 0) === 4}
          onChange={(v) => onChange("anioDescuento", v)}
        />
      </div>
    </div>
  );
}

export { AsesorSection };
