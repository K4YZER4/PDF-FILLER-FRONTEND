import { api } from "@/lib/api";

export interface AsesorApiItem {
  id: number;
  codigoEmpleado: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  folio: string;
  sucursal: string | null;
}

export async function getAsesores(): Promise<AsesorApiItem[]> {
  const { data } = await api.get<AsesorApiItem[]>("/api/asesores");
  return data;
}
