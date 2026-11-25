/** Servicio de OCR. Escanea documentos y extrae datos. */
import { api } from "@/lib/api"
import type { INEData, NominaData, EstadoCuentaData } from "@/types"

const SCAN_INE = "/api/ine"
const SCAN_NOMINAS = "/api/nominas"
const SCAN_ESTADO_CUENTA = "/api/estados-cuenta"
const SCAN_UNIFICADO = "/api/escaneos/unificado"

export interface ScanUnificadoResult {
  ine: any | null;
  nomina: any | null;
  estadoCuenta: any | null;
}

/** Escanea todos los documentos en una sola llamada unificada. */
export async function scanUnificado(files: {
  ine?: File;
  nomina1?: File;
  nomina2?: File;
  estadoCuenta?: File;
}): Promise<ScanUnificadoResult> {
  const fd = new FormData()
  if (files.ine) fd.append("ine", files.ine)
  if (files.nomina1) fd.append("nomina1", files.nomina1)
  if (files.nomina2) fd.append("nomina2", files.nomina2)
  if (files.estadoCuenta) fd.append("estadoCuenta", files.estadoCuenta)

  const res = await api.post<ScanUnificadoResult>(SCAN_UNIFICADO, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res.data
}

/** Escanea una INE y devuelve los datos extraídos. */
export async function scanINE(file: File) {
  const fd = new FormData()
  fd.append("ine", file)
  const res = await api.post<INEData>(SCAN_INE, fd)
  return res.data
}

/** Escanea las dos nóminas y devuelve los datos laborales. */
export async function scanNomina(file1: File, file2: File) {
  const fd = new FormData()
  fd.append("nomina1", file1)
  fd.append("nomina2", file2)
  const res = await api.post<{ datos: NominaData }>(SCAN_NOMINAS, fd)
  return res.data.datos
}

/** Escanea un estado de cuenta y devuelve los datos bancarios. */
export async function scanEstadoCuenta(file: File) {
  const fd = new FormData()
  fd.append("estadoCuenta", file)
  const res = await api.post<{ datos: EstadoCuentaData }>(SCAN_ESTADO_CUENTA, fd)
  return res.data.datos
}
