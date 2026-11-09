/**
 * Barrel export de servicios API organizados por feature.
 * Cada archivo agrupa funciones relacionadas a un recurso del backend.
 *
 * Uso:
 *   import { login } from "@/api/auth.api"
 *   import { scanINE, scanNomina } from "@/api/scan.api"
 *   import { calcularTabla } from "@/api/calculo.api"
 *   import { getContract, updateContract } from "@/api/contracts.api"
 */
export { login } from "./auth.api"
export { scanINE, scanNomina, scanEstadoCuenta } from "./scan.api"
export { calcularTabla } from "./calculo.api"
export { getHistorial, getContract, reabrirFirma, updateContract } from "./contracts.api"
