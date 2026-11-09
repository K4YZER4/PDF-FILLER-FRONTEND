/** Servicio de cálculo de tabla crediticia. POST /api/tablas/consultas */
import { api } from "@/lib/api"
import type { TablaCreditoData } from "@/types"

const CALCULAR_URL = "/api/tablas/consultas"

interface CalcularTablaRequest {
  monto: number
  quincenas: number
}

/** Envía monto y plazo al backend y devuelve la tabla de amortización. */
export async function calcularTabla(monto: number, quincenas: number) {
  const body: CalcularTablaRequest = { monto, quincenas }
  const res = await api.post<TablaCreditoData>(CALCULAR_URL, body)
  return res.data
}
