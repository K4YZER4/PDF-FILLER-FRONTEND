/** Validadores compartidos para los datos del paso 3 (préstamo).
 *  Funciones puras que verifican la completitud de cada sección.
 *
 *  Separadas de useCreditoAsesor.ts para:
 *   - Evitar la duplicación con useStepValidation.ts
 *   - Facilitar tests unitarios sin React
 *   - Mantener la lógica de negocio en un solo lugar
 *
 *  Uso:
 *    import { isAsesorComplete } from "./utils/validation"; */
import type {
  AsesorData,
  ContactoData,
  AntiguedadData,
  Referencias,
} from "@/types";

export function isAsesorComplete(d: AsesorData): boolean {
  return (
    (d.folio?.length ?? 0) === 5 &&
    (d.sucursal?.trim()?.length ?? 0) > 0 &&
    (d.numVendedor?.length ?? 0) === 3 &&
    (d.asesor?.trim()?.length ?? 0) > 0 &&
    (d.fechaContrato?.length ?? 0) > 0
  );
}

export function isContactoComplete(d: ContactoData): boolean {
  return (
    (d.tel?.length ?? 0) === 10 &&
    (d.celular?.length ?? 0) === 10 &&
    (d.telCasa?.length ?? 0) === 10 &&
    (d.correo?.includes?.("@") ?? false) &&
    (d.estadoCivil?.length ?? 0) > 0
  );
}

export function isAntiguedadComplete(d: AntiguedadData): boolean {
  return (
    (d.fechaIngreso?.length ?? 0) > 0 &&
    (d.meses?.length ?? 0) > 0 &&
    (d.anos?.length ?? 0) > 0
  );
}

export function isReferenciasComplete(refs: Referencias): boolean {
  return refs.every(
    (r) => (r?.nombre?.trim()?.length ?? 0) > 0 && (r?.telefono?.length ?? 0) === 10,
  );
}
