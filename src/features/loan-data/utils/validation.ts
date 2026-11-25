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

export function isPrestamoComplete(
  monto: number,
  d: AsesorData,
): boolean {
  const fechaArranqueDay = d?.fechaArranque
    ? new Date(d.fechaArranque + "T12:00:00").getDate()
    : 0;
  const fechaArranqueValid =
    (d?.fechaArranque?.length ?? 0) > 0 &&
    (fechaArranqueDay === 15 || fechaArranqueDay === 30);

  return (
    monto >= 3000 &&
    monto % 1000 === 0 &&
    fechaArranqueValid &&
    (d?.lugar?.trim()?.length ?? 0) > 0 &&
    (d?.mesDescuento?.trim()?.length ?? 0) > 0 &&
    (d?.anioDescuento?.trim()?.length ?? 0) === 4
  );
}

export function isAsesorComplete(d: AsesorData): boolean {
  return (
    (d.folio?.length ?? 0) === 5 &&
    (d.sucursal?.trim()?.length ?? 0) > 0 &&
    (d.numVendedor?.length ?? 0) === 6 &&
    (d.asesor?.trim()?.length ?? 0) > 0 &&
    (d.fechaContrato?.length ?? 0) > 0
  );
}

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isContactoComplete(d: ContactoData): boolean {
  const depNum = Number(d?.dependientesEconomicos);
  const depValid =
    (d?.dependientesEconomicos?.trim()?.length ?? 0) > 0 &&
    !isNaN(depNum) &&
    depNum >= 0 &&
    depNum <= 20;

  const email = d?.correo?.trim() ?? "";
  const emailValid = email.length > 0 && email.length <= 150 && EMAIL_REGEX.test(email);

  const telCasaValid = !d?.telCasa || d.telCasa.trim().length === 0 || d.telCasa.trim().length === 10;

  return (
    (d?.celular?.trim()?.length ?? 0) === 10 &&
    telCasaValid &&
    emailValid &&
    (d?.estadoCivil?.trim()?.length ?? 0) > 0 &&
    depValid &&
    (d?.propiedad?.trim()?.length ?? 0) > 0 &&
    (d?.entreCalles?.trim()?.length ?? 0) > 0 &&
    (d?.entreCalles?.length ?? 0) <= 100
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
