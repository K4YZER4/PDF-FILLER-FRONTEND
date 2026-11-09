/**
 * Archivo: src/store/selectors.ts
 *
 * Selectores tipados para extraer datos del store sin usar `as any`.
 *
 * Problema que resuelve:
 *   El store usa `Partial<INEData>` para formData.ine porque los datos
 *   llegan progresivamente del OCR. Esto significa que TypeScript sabe
 *   que `primerNombre` podría ser `string | undefined`, pero en lugar de
 *   usar optional chaining, el código original usaba `as any` para silenciar
 *   el tipo, perdiendo toda seguridad de tipos.
 *
 * Solución:
 *   Estos selectores envuelven el acceso con valores default (string vacío)
 *   para que los componentes consuman datos limpios sin null checks
 *   y manteniendo el tipado fuerte.
 *
 * Uso:
 *   const { primerNombre, curp } = useINEData()
 *   const { rfc, ingresoMensual } = useNominaData()
 */

import { useContractStore } from "./useContractStore";
import type {
  INEData,
  NominaData,
  EstadoCuentaData,
  AsesorData,
  ContactoData,
  AntiguedadData,
  Referencias,
} from "@/types";

/** Hook selector para datos de la INE con valores default */
export function useINEData() {
  const ine = useContractStore((s) => s.formData.ine);
  return {
    primerNombre: ine.primerNombre ?? "",
    segundoNombre: ine.segundoNombre ?? "",
    primerApellido: ine.primerApellido ?? "",
    segundoApellido: ine.segundoApellido ?? "",
    curp: ine.curp ?? "",
    sexo: ine.sexo ?? "",
    fechaNacimiento: ine.fechaNacimiento ?? "",
    claveElector: ine.claveElector ?? "",
    domicilio: {
      calle: ine.domicilio?.calle ?? "",
      codigoPostal: ine.domicilio?.codigoPostal ?? "",
      colonia: ine.domicilio?.colonia ?? "",
      noExt: ine.domicilio?.noExt ?? "",
      noInt: ine.domicilio?.noInt ?? "",
      municipio: ine.domicilio?.municipio ?? "",
      estado: ine.domicilio?.estado ?? "",
    },
  } satisfies Partial<INEData>;
}

/** Hook selector para datos laborales con valores default */
export function useNominaData() {
  const nomina = useContractStore((s) => s.formData.nomina);
  return {
    rfc: nomina.rfc ?? "",
    noEmpleado: nomina.noEmpleado ?? "",
    dependencia: nomina.dependencia ?? "",
    departamento: nomina.departamento ?? "",
    puesto: nomina.puesto ?? "",
    ingresoMensual: nomina.ingresoMensual ?? 0,
  } satisfies Partial<NominaData>;
}

/** Hook selector para datos bancarios con valores default */
export function useBancoData() {
  const banco = useContractStore((s) => s.formData.banco);
  return {
    noCuenta: banco.noCuenta ?? "",
    banco: banco.banco ?? "",
    clabe: banco.clabe ?? "",
  } satisfies Partial<EstadoCuentaData>;
}

/** Hook selector para la tabla de crédito */
export function useTablaData() {
  return useContractStore((s) => s.formData.tabla);
}

// Hook selectores para datos del paso 3 (préstamo) con valores default
export function useAsesorData() {
  const data = useContractStore((s) => s.formData.asesorData);
  return data satisfies AsesorData;
}

// Hook selector para datos de contacto
export function useContactoData() {
  const data = useContractStore((s) => s.formData.contactoData);
  return data satisfies ContactoData;
}

// Hook selector para datos de antigüedad laboral
export function useAntiguedadData() {
  const data = useContractStore((s) => s.formData.antiguedadData);
  return data satisfies AntiguedadData;
}

// Hook selector para referencias personales
export function useReferencias() {
  const refs = useContractStore((s) => s.formData.referencias);
  return refs satisfies Referencias;
}

/** Construye el nombre completo del cliente desde los datos de la INE */
export function useClientName(): string {
  const ine = useContractStore((s) => s.formData.ine);
  return (
    [
      ine.primerNombre,
      ine.segundoNombre,
      ine.primerApellido,
      ine.segundoApellido,
    ]
      .filter(Boolean)
      .join(" ")
      .toUpperCase() || "CLIENTE"
  );
}
