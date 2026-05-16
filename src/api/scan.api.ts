/** Servicio de OCR. Escanea documentos y extrae datos. */
import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { INEData, NominaData, EstadoCuentaData } from "@/types"

const SCAN_INE = "/scan/ine"
const SCAN_NOMINA = "/scan/nomina"
const SCAN_ESTADO_CUENTA = "/scan/estado-cuenta"

function toFormData(file: File): FormData {
  const fd = new FormData()
  fd.append("file", file)
  return fd
}

/** Escanea una INE y devuelve los datos extraídos. */
export async function scanINE(file: File) {
  const res = await api.post<ApiResponse<INEData>>(SCAN_INE, toFormData(file))
  return res.data.data
}

/** Escanea una nómina y devuelve los datos laborales. */
export async function scanNomina(file: File) {
  const res = await api.post<ApiResponse<NominaData>>(SCAN_NOMINA, toFormData(file))
  return res.data.data
}

/** Escanea un estado de cuenta y devuelve los datos bancarios. */
export async function scanEstadoCuenta(file: File) {
  const res = await api.post<ApiResponse<EstadoCuentaData>>(SCAN_ESTADO_CUENTA, toFormData(file))
  return res.data.data
}
