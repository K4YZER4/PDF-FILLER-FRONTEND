/** Servicio de contratos. CRUD contra /api/contracts */
import { api } from "@/lib/api"
import type { Contract } from "@/store/useContractStore"
import type { ReabrirFirmaResponse } from "@/types"

const CONTRACTS_URL = "/api/contratos"

interface HistorialParams {
  asesorId?: number;
  desde?: string;
  hasta?: string;
  buscar?: string;
}

/** Obtiene historial de contratos desde la vista en DB. */
export async function getHistorial(params?: HistorialParams) {
  const res = await api.get<Contract[]>(`${CONTRACTS_URL}/historial`, { params })
  return res.data
}

/** Obtiene todos los datos de un contrato por folio para edición. */
export async function getContract(folio: string) {
  const res = await api.get(`${CONTRACTS_URL}/${folio}`)
  return res.data
}

/** Reabre un contrato para re-firma: resetea a POR FIRMAR y genera nuevo token. */
export async function reabrirFirma(folio: string) {
  const res = await api.post<ReabrirFirmaResponse>(`/api/contratos/${folio}/reabrir-firma`)
  return res.data
}

export async function aprobarContrato(folio: string) {
  const res = await api.post<{ folio: string; estado: string; mensaje: string }>(
    `${CONTRACTS_URL}/${folio}/aprobar`,
  );
  return res.data;
}

export async function rechazarContrato(folio: string, motivo: string) {
  const res = await api.post<{ folio: string; estado: string; mensaje: string }>(
    `${CONTRACTS_URL}/${folio}/rechazar`,
    { motivo },
  );
  return res.data;
}

/** Actualiza un contrato existente y regenera el PDF. */
export async function updateContract(folio: string, payload: FormData) {
  const res = await api.put(`${CONTRACTS_URL}/${folio}`, payload, {
    responseType: "blob",
    headers: { "Content-Type": "multipart/form-data" },
  })
  return res
}
