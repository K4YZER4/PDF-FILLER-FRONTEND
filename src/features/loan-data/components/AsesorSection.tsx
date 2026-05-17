/**
 * Archivo: features/loan-data/components/AsesorSection.tsx
 *
 * Sección 2 del accordion: datos del asesor.
 *
 * Campos:
 *   - Folio (5 dígitos)
 *   - Sucursal (solo letras)
 *   - Núm. Vendedor (3 dígitos)
 *   - Asesor: si el usuario es admin, puede seleccionar de una lista;
 *     si no, ve su nombre bloqueado.
 *   - Fecha Contrato, Fecha Arranque (date picker)
 *   - Lugar (solo letras)
 *   - Mes de Descuento (selector)
 *   - Año de Descuento (4 dígitos)
 */
import { Input, NameInput, NumericInput, DateInput } from "@/components/ui";
import { SelectField } from "./SelectField";
import { ASESORES_REGISTRADOS, MESES } from "../constants";
import type { AsesorData } from "../types";

interface AsesorSectionProps {
  data: AsesorData;
  userRole: string | null;
  userName: string;
  onChange: <K extends keyof AsesorData>(key: K, value: AsesorData[K]) => void;
}

function AsesorSection({
  data,
  userRole,
  userName,
  onChange,
}: AsesorSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          success={(data.folio?.length ?? 0) === 5}
          error={
            (data.folio?.length ?? 0) > 0 && (data.folio?.length ?? 0) !== 5
              ? "Deben ser 5 dígitos"
              : undefined
          }
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
          success={(data.numVendedor?.length ?? 0) === 3}
          error={
            (data.numVendedor?.length ?? 0) > 0 &&
            (data.numVendedor?.length ?? 0) !== 3
              ? "Deben ser 3 dígitos"
              : undefined
          }
          onChange={(v) => onChange("numVendedor", v)}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Asesor <span className="text-error">*</span>
        </label>
        {userRole === "admin" ? (
          <SelectField
            id="asesor"
            value={data.asesor}
            options={ASESORES_REGISTRADOS}
            placeholder="Seleccionar asesor"
            success={(data.asesor?.trim()?.length ?? 0) > 0}
            onChange={(v) => onChange("asesor", v)}
          />
        ) : (
          <Input
            id="asesor"
            value={userName}
            disabled
            inputSize="sm"
            success={userName.length > 0}
            className="text-text-primary"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-text-secondary">
          Fecha Contrato <span className="text-error">*</span>
        </label>
        <DateInput
          id="fechaContrato"
          value={data.fechaContrato}
          inputSize="sm"
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
          success={(data.anioDescuento?.length ?? 0) === 4}
          error={
            (data.anioDescuento?.length ?? 0) > 0 &&
            (data.anioDescuento?.length ?? 0) !== 4
              ? "Deben ser 4 dígitos"
              : undefined
          }
          onChange={(v) => onChange("anioDescuento", v)}
        />
      </div>
    </div>
  );
}

export { AsesorSection };
