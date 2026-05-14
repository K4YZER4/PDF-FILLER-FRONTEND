/**
 * Barrel export del feature loan-data (paso 3 del flujo).
 *
 * Re-exporta el componente principal y los tipos para que
 * se pueda importar desde App.tsx sin conocer la estructura interna.
 */
export { CreditoAsesor } from "./CreditoAsesor"
export type {
  AsesorData,
  ContactoData,
  AntiguedadData,
  ReferenciaItem,
  Referencias,
  ResultadoCalculo,
} from "./types"
