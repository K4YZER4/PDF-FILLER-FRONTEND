/** Tipos compartidos del dominio de contratos CREDIFOM. */

/** Estados posibles del escaneo de documentos */
export type ScanStatus = "idle" | "scanning" | "done" | "error";

/** Datos extraídos de la INE: información personal y domicilio */
export interface INEData {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  curp: string;
  sexo: string;
  fechaNacimiento: string;
  claveElector: string;
  domicilio: {
    calle: string;
    codigoPostal: string;
    colonia: string;
    noExt: string;
    noInt: string;
    municipio: string;
    estado: string;
  };
}

/** Datos laborales extraídos de la nómina */
export interface NominaData {
  rfc: string;
  noEmpleado: string;
  dependencia: string;
  departamento: string;
  puesto: string;
  ingresoMensual: number;
  telefonoEmpresarial: string;
  emailLaboral: string;
}

/** Datos bancarios extraídos del estado de cuenta */
export interface EstadoCuentaData {
  noCuenta: string;
  banco: string;
  clabe: string;
  nombreTitular: string;
  rfc: string;
}

/** Resultado del cálculo de la tabla crediticia (amortización).
 *  Usado tanto en el store (FormDataState.tabla) como en los componentes
 *  del paso 3 (PrestamoSection, useCreditoAsesor). */
export interface TablaCreditoData {
  montoPagare: number;
  descuentoQuincenal: number;
  tasaMensual: number;
  cat: number;
}

// ─── Datos complementarios del paso 3 (préstamo) ────────────────────────────

/** Datos del asesor capturados en la sección "Datos del Asesor". */
export interface AsesorData {
  folio: string;
  sucursal: string;
  numVendedor: string;
  asesor: string;
  fechaContrato: string;
  fechaArranque: string;
  lugar: string;
  mesDescuento: string;
  anioDescuento: string;
}

/** Teléfonos, correo y estado civil del cliente. */
export interface ContactoData {
  tel: string;
  celular: string;
  telCasa: string;
  correo: string;
  estadoCivil: string;
  dependientesEconomicos: string;
  propiedad: string;
  entreCalles: string;
}

/** Antigüedad laboral: fecha de ingreso, meses y años. */
export interface AntiguedadData {
  fechaIngreso: string;
  meses: string;
  anos: string;
}

/** Una referencia personal con nombre y teléfono. */
export interface ReferenciaItem {
  nombre: string;
  telefono: string;
}

/** Tupla fija de exactamente 3 referencias personales. */
export type Referencias = [ReferenciaItem, ReferenciaItem, ReferenciaItem];

// ─── Firma digital ──────────────────────────────────────────────────────────

export interface SignatureContractData {
  folio: string;
  nombre: string;
  curp: string;
  importeCredito: string;
  importeTotal: string;
  pagoQuincenal: string;
}

export interface SignatureResponse {
  contrato: SignatureContractData;
  pdfUrl: string;
}

export interface FirmarResponse {
  success: boolean;
  message: string;
}

export interface GenerarEnlaceResponse {
  link: string;
  token: string;
  expira: string;
  correoEnviado: boolean;
  modoDemo: boolean;
  mensajeCorreo: string;
}

export interface ReabrirFirmaResponse {
  link: string;
  token: string;
  expira: string;
  correoEnviado?: boolean;
  modoDemo?: boolean;
  mensajeCorreo?: string;
}
