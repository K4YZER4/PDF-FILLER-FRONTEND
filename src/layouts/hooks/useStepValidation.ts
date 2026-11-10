/** Hook que encapsula la lógica de validación por paso del flujo de contrato.
 *  Determina si el paso actual tiene todos los campos obligatorios completos
 *  para habilitar el botón "Siguiente" / "Generar Contrato".
 *
 *  Cada paso tiene sus propias reglas:
 *   - upload → escaneo completado
 *   - review → datos personales, domicilio, laborales y bancarios llenos
 *   - loan   → monto válido + todos los campos del paso 3 completos
 *   - preview → siempre true (no hay validación extra)
 *
 *  Uso:
 *    const canContinue = useStepValidation(currentSegment) */
import { useContractStore } from "@/store/useContractStore";
import type { FormDataState } from "@/store/useContractStore";
import {
  isAsesorComplete,
  isContactoComplete,
  isAntiguedadComplete,
  isReferenciasComplete,
} from "@/features/loan-data/utils/validation";

/** Valida todos los campos del paso "review" (INE + nómina + banco). */
function validateReviewStep(formData: FormDataState): boolean {
  const { ine, nomina, banco } = formData;
  const d = ine.domicilio;

  const allPersonales = [
    ine.primerNombre,
    ine.segundoNombre,
    ine.primerApellido,
    ine.segundoApellido,
    ine.curp,
    ine.sexo,
    ine.fechaNacimiento,
    ine.claveElector,
  ].every((f) => f?.trim());

  const allDomicilio = [
    d?.calle,
    d?.codigoPostal,
    d?.colonia,
    d?.noExt,
    d?.municipio,
    d?.estado,
  ].every((f) => f?.trim());

  const laboralFields = [
    nomina.rfc,
    nomina.noEmpleado,
    nomina.dependencia,
    nomina.departamento,
    nomina.puesto,
  ];
  const allLaborales =
    laboralFields.every((f) => f?.trim()) &&
    Number(nomina.ingresoMensual) > 0;

  const allBancarios = [banco.noCuenta, banco.banco, banco.clabe].every((f) =>
    f?.trim(),
  );

  return allPersonales && allDomicilio && allLaborales && allBancarios;
}

/** Valida todos los campos del paso "loan": monto válido + secciones completas.
 *  La tabla de amortización es opcional (se calcula con "Calcular" si el usuario
 *  quiere verla, pero no bloquea la generación del contrato). */
function validateLoanStep(formData: FormDataState): boolean {
  const m = formData.capitalMonto;
  if (m <= 0 || m % 1000 !== 0) return false;
  if (!formData.tabla || formData.tabla.montoPagare <= m) return false;

  return (
    isAsesorComplete(formData.asesorData) &&
    isContactoComplete(formData.contactoData) &&
    isAntiguedadComplete(formData.antiguedadData) &&
    isReferenciasComplete(formData.referencias)
  );
}

/** Función pura de validación — fácil de testear sin React. */
export function canProceed(
  currentSegment: string,
  scanStatus: string,
  formData: FormDataState,
): boolean {
  switch (currentSegment) {
    case "upload":
      return scanStatus === "done";
    case "review":
      return validateReviewStep(formData);
    case "loan":
      return validateLoanStep(formData);
    default:
      return false;
  }
}

/** Hook que suscribe al store y retorna si el paso actual puede continuar. */
export function useStepValidation(currentSegment: string): boolean {
  const scanStatus = useContractStore((s) => s.documents.scanStatus);
  const formData = useContractStore((s) => s.formData);
  return canProceed(currentSegment, scanStatus, formData);
}
