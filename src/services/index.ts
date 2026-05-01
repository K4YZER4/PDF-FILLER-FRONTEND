/**
 * Archivo: services/index.ts
 * Propósito: Archivo barrel que re-exporta todos los servicios de la aplicación.
 * Facilita las importaciones centralizadas de la capa de servicios.
 */

// Cliente HTTP base
export { apiFetch, apiFetchBlob, apiPostForm, apiPostJson, API_BASE } from "./api.client"

// Servicios para INE
export { scanINE } from "./ine.service"

// Servicios para Nómina y Estado de Cuenta
export { scanNomina, scanEstadoCuenta } from "./nomina.service"

// Servicios para Cálculo de Crédito y Generación de Contrato
export { calcularTabla, generarContrato, testConnection } from "./credito.service"
