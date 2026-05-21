/**
 * Archivo: features/loan-data/types.ts
 *
 * Re-exporta los tipos del paso 3 desde @/types para mantener
 * compatibilidad con imports existentes dentro del feature.
 *
 * Los tipos están definidos en src/types/index.ts para que el store
 * y otros features puedan usarlos sin depender de loan-data.
 */
export type {
  AsesorData,
  ContactoData,
  AntiguedadData,
  ReferenciaItem,
  Referencias,
  TablaCreditoData,
} from "@/types"
