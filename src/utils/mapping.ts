/** Funciones de mapeo entre el formato del frontend (camelCase) y el backend (snake_case).
 *
 *  El frontend usa camelCase para todos los tipos internos (INEData, NominaData, etc.)
 *  mientras que el backend espera snake_case en sus endpoints.
 *
 *  Uso:
 *    import { mapIneFromApi, mapIneToApi } from "@/utils/mapping"; */
import type { INEData, NominaData, EstadoCuentaData, TablaCreditoData } from "@/types";
import type { FormDataState } from "@/types/store";

// ─── INE ────────────────────────────────────────────────────────────────────

interface BackendIneData {
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  sexo: string;
  fechaNac: string;
  curp: string;
  claveElector: string;
  domicilio: {
    calle: string;
    numeroCasa: string;
    numeroInterior?: string;
    colonia: string;
    codigoPostal: string;
    municipio: string;
    estado: string;
  };
  seccion?: string;
  vigencia?: string;
  numEmision?: string;
}

export function mapIneFromApi(data: BackendIneData): Partial<INEData> {
  return {
    primerNombre: data.nombre1 ?? "",
    segundoNombre: data.nombre2 ?? "",
    primerApellido: data.apellidoPaterno ?? "",
    segundoApellido: data.apellidoMaterno ?? "",
    curp: data.curp ?? "",
    sexo: data.sexo === "M" ? "MASCULINO" : data.sexo === "F" ? "FEMENINO" : "",
    fechaNacimiento: data.fechaNac
      ? data.fechaNac.includes("/")
        ? data.fechaNac.split("/").reverse().join("-")
        : data.fechaNac
      : "",
    claveElector: data.claveElector ?? "",
    domicilio: {
      calle: data.domicilio?.calle ?? "",
      codigoPostal: data.domicilio?.codigoPostal ?? "",
      colonia: data.domicilio?.colonia ?? "",
      noExt: data.domicilio?.numeroCasa ?? "",
      noInt: data.domicilio?.numeroInterior ?? "",
      municipio: data.domicilio?.municipio ?? "",
      estado: data.domicilio?.estado ?? "",
    },
  };
}

export function mapIneToApi(ine: Partial<INEData>): BackendIneData {
  return {
    nombre1: ine.primerNombre ?? "",
    nombre2: ine.segundoNombre ?? "",
    apellidoPaterno: ine.primerApellido ?? "",
    apellidoMaterno: ine.segundoApellido ?? "",
    sexo: ine.sexo === "MASCULINO" ? "M" : ine.sexo === "FEMENINO" ? "F" : "",
    fechaNac: ine.fechaNacimiento ?? "",
    curp: ine.curp ?? "",
    claveElector: ine.claveElector ?? "",
    domicilio: {
      calle: ine.domicilio?.calle ?? "",
      numeroCasa: ine.domicilio?.noExt ?? "",
      numeroInterior: ine.domicilio?.noInt ?? "",
      colonia: ine.domicilio?.colonia ?? "",
      codigoPostal: ine.domicilio?.codigoPostal ?? "",
      municipio: ine.domicilio?.municipio ?? "",
      estado: ine.domicilio?.estado ?? "",
    },
  };
}

// ─── Nómina ─────────────────────────────────────────────────────────────────

interface BackendNominaDatos {
  noEmpleado: string;
  rfc: string;
  puesto: string;
  departamento: string;
  dependencia: string;
  ingresoMensual: number;
  telefonoEmpresarial?: string;
  emailLaboral?: string;
}

export function mapNominaFromApi(data: BackendNominaDatos): Partial<NominaData> {
  return {
    rfc: data.rfc ?? "",
    noEmpleado: data.noEmpleado ?? "",
    dependencia: data.dependencia ?? "",
    departamento: data.departamento ?? "",
    puesto: data.puesto ?? "",
    ingresoMensual: data.ingresoMensual ?? 0,
    telefonoEmpresarial: data.telefonoEmpresarial ?? "",
    emailLaboral: data.emailLaboral ?? "",
  };
}

export function mapNominaToApi(nomina: Partial<NominaData>): BackendNominaDatos {
  return {
    rfc: nomina.rfc ?? "",
    noEmpleado: nomina.noEmpleado ?? "",
    dependencia: nomina.dependencia ?? "",
    departamento: nomina.departamento ?? "",
    puesto: nomina.puesto ?? "",
    ingresoMensual: nomina.ingresoMensual ?? 0,
    telefonoEmpresarial: nomina.telefonoEmpresarial ?? "",
    emailLaboral: nomina.emailLaboral ?? "",
  };
}

// ─── Estado de Cuenta ────────────────────────────────────────────────────────

interface BackendEstadoCuenta {
  nombreTitular: string;
  rfc: string;
  banco: string;
  numeroCuenta: string;
  clabe: string;
}

export function mapEstadoCuentaFromApi(data: BackendEstadoCuenta): Partial<EstadoCuentaData> {
  return {
    noCuenta: data.numeroCuenta ?? "",
    banco: data.banco ?? "",
    clabe: data.clabe ?? "",
    nombreTitular: data.nombreTitular ?? "",
    rfc: data.rfc ?? "",
  };
}

export function mapEstadoCuentaToApi(banco: Partial<EstadoCuentaData>): BackendEstadoCuenta {
  return {
    nombreTitular: banco.nombreTitular ?? "",
    rfc: banco.rfc ?? "",
    banco: banco.banco ?? "",
    numeroCuenta: banco.noCuenta ?? "",
    clabe: banco.clabe ?? "",
  };
}

// ─── Tabla de Crédito ────────────────────────────────────────────────────────

interface BackendTablaResponse {
  montoNeto: number;
  montoPagare: number;
  descuentoQuincenal: number;
  plazoQuincenas: number;
  plazoMeses: number;
  tasaMensual: number;
  tasaAnual: number;
  importeInteres: number;
  cat: number;
}

export function mapTablaFromApi(data: BackendTablaResponse): TablaCreditoData {
  return {
    montoPagare: data.montoPagare,
    descuentoQuincenal: data.descuentoQuincenal,
    tasaMensual: data.tasaMensual,
    cat: data.cat,
  };
}

// ─── Payload para POST /api/pdfs ─────────────────────────────────────────────

interface ContratoPayload {
  ine: BackendIneData;
  tabla: {
    montoNeto: number;
    montoPagare: number;
    descuentoQuincenal: number;
    plazoMeses: number;
    plazoQuincenas: number;
    tasaMensual: number;
    importeInteres: number;
    cat: number;
  };
  extra: {
    telefonoCelular: string;
    telefonoCasa?: string;
    mail: string;
    dependientesEconomicos: number;
    fechaIngreso: string;
    fechaContrato: string;
    fechaArranque?: string;
    referencia1?: string;
    referencia2?: string;
    referencia3?: string;
    telefonoReferencia1?: string;
    telefonoReferencia2?: string;
    telefonoReferencia3?: string;
    numVendedor?: string;
    sucursal?: string;
    vendedor?: string;
    lugarFecha?: string;
    estadoCivil?: string;
    propiedad?: string;
    entreCalles?: string;
    mesDescuento?: string;
    añoDescuento?: string;
  };
  estadoCuenta: BackendEstadoCuenta;
  nomina: BackendNominaDatos;
}

export function buildContratoPayload(formData: FormDataState): ContratoPayload {
  const montoNeto = Math.round(formData.capitalMonto || 0);
  const montoPagare = formData.tabla?.montoPagare ?? 0;
  const importeInteres = montoPagare - montoNeto;

  return {
    ine: mapIneToApi(formData.ine),
    tabla: {
      montoNeto,
      montoPagare,
      descuentoQuincenal: formData.tabla?.descuentoQuincenal ?? 0,
      plazoMeses: Math.round((formData.plazoQnas || 48) / 2),
      plazoQuincenas: formData.plazoQnas || 48,
      tasaMensual: formData.tabla?.tasaMensual ?? 0,
      importeInteres: importeInteres > 0 ? importeInteres : 0,
      cat: formData.tabla?.cat ?? 0,
    },
    extra: {
      telefonoCelular: formData.contactoData?.celular ?? "",
      telefonoCasa: formData.contactoData?.telCasa || undefined,
      mail: formData.contactoData?.correo ?? "",
      dependientesEconomicos: Number(formData.contactoData?.dependientesEconomicos) || 0,
      fechaIngreso: formData.antiguedadData?.fechaIngreso ?? "",
      fechaContrato: formData.asesorData?.fechaContrato ?? "",
      fechaArranque: formData.asesorData?.fechaArranque || undefined,
      referencia1: formData.referencias?.[0]?.nombre || undefined,
      referencia2: formData.referencias?.[1]?.nombre || undefined,
      referencia3: formData.referencias?.[2]?.nombre || undefined,
      telefonoReferencia1: formData.referencias?.[0]?.telefono || undefined,
      telefonoReferencia2: formData.referencias?.[1]?.telefono || undefined,
      telefonoReferencia3: formData.referencias?.[2]?.telefono || undefined,
      numVendedor: formData.asesorData?.numVendedor || undefined,
      sucursal: formData.asesorData?.sucursal || undefined,
      vendedor: formData.asesorData?.asesor || undefined,
      lugarFecha: formData.asesorData?.lugar || undefined,
      estadoCivil: formData.contactoData?.estadoCivil || undefined,
      propiedad: formData.contactoData?.propiedad || undefined,
      entreCalles: formData.contactoData?.entreCalles || undefined,
      mesDescuento: formData.asesorData?.mesDescuento || undefined,
      añoDescuento: formData.asesorData?.anioDescuento || undefined,
    },
    estadoCuenta: mapEstadoCuentaToApi(formData.banco),
    nomina: mapNominaToApi(formData.nomina),
  };
}
