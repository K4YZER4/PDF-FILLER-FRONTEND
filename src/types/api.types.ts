/**
 * Archivo: types/api.types.ts
 * Propósito: Define tipos para la comunicación con el backend API.
 * Incluye estados de escaneo, respuestas y el payload para generar contratos.
 */

/** Estados posibles durante el proceso de escaneo de documentos */
type ScanStatus = "idle" | "scanning" | "done" | "error"

/** Estados de las pestañas de la aplicación */
type TabStatus = "idle" | "scanning" | "complete"

/** Respuesta genérica del API */
interface ApiResponse<T> {
  data: T
  message?: string
}

/** Estructura de errores devueltos por el API */
interface ApiError {
  error: string
  status: number
}

/**
 * Payload completo enviado al API para generar el contrato PDF.
 * Incluye todos los datos recolectados en las 3 pestañas.
 */
interface ContractGenerationPayload {
  ine: {
    nombre1: string
    nombre2: string
    apellidoPaterno: string
    apellidoMaterno: string
    curp: string
    fechaNac: string
    claveElector: string
    sexo: string
    seccion: string
    vigencia: string
    numEmision: string
    domicilio: {
      calle: string
      numeroCasa: string
      colonia: string
      codigoPostal: string
      municipio: string
      estado: string
    }
  }
  tabla: {
    montoPagare: number
    descuentoQuincenal: number
    cat: number
    tasaMensual: number
    importeInteres?: number
    montoNeto: number
    plazoQuincenas: number
  }
  nomina: {
    rfc: string
    noEmpleado: string
    puesto: string
    departamento: string
    dependencia: string
    ingresoMensual: number
  }
  estadoCuenta: {
    rfc: string
    numeroCuenta: string
    clabe: string
    banco: string
  }
  extra: {
    folio: string
    sucursal: string
    numVendedor: string
    vendedor: string
    fechaContrato: string
    fechaArranque: string
    lugarFecha: string
    mesDescuento: string
    añoDescuento: string
    telefonoCelular: string
    telefonoCasa: string
    mail: string
    estadoCivil: string
    mesesAntiguedad: string
    añosAntiguedad: string
    referencia1: string
    referencia2: string
    referencia3: string
    telefonoReferencia1: string
    telefonoReferencia2: string
    telefonoReferencia3: string
  }
}

export type {
  ScanStatus,
  TabStatus,
  ApiResponse,
  ApiError,
  ContractGenerationPayload,
}
