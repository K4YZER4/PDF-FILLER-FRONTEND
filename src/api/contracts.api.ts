/** Servicio de contratos. CRUD contra /api/contracts */
import { api } from "@/lib/api"
import type { ApiResponse, PaginatedResponse, ContractDTO, CreateContractRequest } from "@/types/api"

const CONTRACTS_URL = "/api/contracts"

interface GetContractsParams {
  page?: number
  limit?: number
  search?: string
}

/** Obtiene lista paginada de contratos. */
export async function getContracts(params?: GetContractsParams) {
  const res = await api.get<PaginatedResponse<ContractDTO>>(CONTRACTS_URL, { params })
  return res.data
}

/** Obtiene un contrato por ID. */
export async function getContract(id: string) {
  const res = await api.get<ApiResponse<ContractDTO>>(`${CONTRACTS_URL}/${id}`)
  return res.data.data
}

/** Crea un contrato nuevo con todos los datos del formulario. */
export async function createContract(data: CreateContractRequest) {
  const res = await api.post<ApiResponse<ContractDTO>>(`${CONTRACTS_URL}/generar`, data)
  return res.data.data
}
