/** Tipos compartidos del dominio de contratos CREDIFOM. */

/** Estados posibles del escaneo de documentos */
export type ScanStatus = "idle" | "scanning" | "done" | "error"

/** Datos extraídos de la INE: información personal y domicilio */
export interface INEData {
  primerNombre: string
  segundoNombre: string
  primerApellido: string
  segundoApellido: string
  curp: string
  sexo: string
  fechaNacimiento: string
  claveElector: string
  domicilio: {
    calle: string
    codigoPostal: string
    colonia: string
    noExt: string
    municipio: string
    estado: string
  }
}

/** Datos laborales extraídos de la nómina */
export interface NominaData {
  rfc: string
  noEmpleado: string
  dependencia: string
  departamento: string
  puesto: string
  ingresoMensual: number
}

/** Datos bancarios extraídos del estado de cuenta */
export interface EstadoCuentaData {
  noCuenta: string
  banco: string
  clabe: string
}

/** Resultado del cálculo de la tabla crediticia */
export interface TablaCreditoData {
  montoPagare: number
  descuentoQuincenal: number
  tasaMensual: number
  cat: number
}
