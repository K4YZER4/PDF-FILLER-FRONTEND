/** Servicio de cálculo de tabla crediticia. POST /api/calcular-tabla */
import { api } from "@/lib/api"
import type { ApiResponse } from "@/types/api"
import type { TablaCreditoData } from "@/types"

const CALCULAR_URL = "/api/calcular-tabla"

interface CalcularTablaRequest {
  monto: number
  quincenas: number
}

/** Envía monto y plazo al backend y devuelve la tabla de amortización. */
export async function calcularTabla(monto: number, quincenas: number) {
  const body: CalcularTablaRequest = { monto, quincenas }
  const res = await api.post<ApiResponse<TablaCreditoData>>(CALCULAR_URL, body)
  return res.data.data
}
