/**
 * Archivo: types/ine.types.ts
 * Propósito: Define los tipos relacionados con la INE (Identificación Nacional Electoral).
 * Estos tipos representan los datos extraídos de la identificación oficial mexicana.
 */

/** Datos del domicilio según la INE */
interface INEDomicilio {
  calle: string
  numeroCasa: string
  colonia: string
  codigoPostal: string
  municipio: string
  estado: string
}

/** Datos completos extraídos de la INE */
interface INEData {
  nombre1: string              // Primer nombre
  nombre2: string              // Segundo nombre
  apellidoPaterno: string      // Apellido paterno
  apellidoMaterno: string      // Apellido materno
  curp: string                 // Clave Única de Registro de Población (18 caracteres)
  sexo: "H" | "M" | ""        // Género: H=Hombre, M=Mujer
  fechaNac: string             // Fecha de nacimiento (formato ISO)
  claveElector: string         // Clave de elector única
  domicilio: INEDomicilio      // Datos del domicilio
  seccion: string              // Sección electoral
  vigencia: string             // Fecha de vigencia de la INE
  numEmision: string           // Número de emisión
}

/** Campos que son llenados automáticamente mediante OCR al escanear la INE */
type ScanINEFields = Pick<
  INEData,
  | "nombre1"
  | "nombre2"
  | "apellidoPaterno"
  | "apellidoMaterno"
  | "curp"
  | "fechaNac"
  | "claveElector"
  | "sexo"
  | "seccion"
  | "vigencia"
  | "numEmision"
> & { domicilio: INEDomicilio }

export type { INEDomicilio, INEData, ScanINEFields }
