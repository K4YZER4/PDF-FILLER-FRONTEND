/**
 * Archivo: features/loan-data/types.ts
 *
 * Tipos de datos del paso 3 del flujo: datos del préstamo y complementarios.
 * Separados del hook y componentes para evitar dependencias circulares
 * y poder importarlos desde cualquier archivo del feature.
 */
/** Datos del asesor capturados en la sección "Datos del Asesor". */
export interface AsesorData {
  folio: string
  sucursal: string
  numVendedor: string
  asesor: string
  fechaContrato: string
  fechaArranque: string
  lugar: string
  mesDescuento: string
  anioDescuento: string
}

/** Teléfonos, correo y estado civil del cliente. */
export interface ContactoData {
  tel: string
  celular: string
  telCasa: string
  correo: string
  estadoCivil: string
}

/** Antigüedad laboral: fecha de ingreso, meses y años. */
export interface AntiguedadData {
  fechaIngreso: string
  meses: string
  anos: string
}

/** Una referencia personal con nombre y teléfono. */
export interface ReferenciaItem {
  nombre: string
  telefono: string
}

/** Tupla fija de exactamente 3 referencias personales. */
export type Referencias = [ReferenciaItem, ReferenciaItem, ReferenciaItem]

/** Resultado del cálculo de tabla de amortización. */
export interface ResultadoCalculo {
  montoPagare: number
  descuentoQuincenal: number
  tasaMensual: number
  cat: number
}
