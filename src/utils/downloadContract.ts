import { api } from "@/lib/api";

export async function downloadContract(folio: string): Promise<void> {
  const response = await api.get(`/api/contratos/${folio}/pdf`, {
    responseType: "blob",
    params: { download: "true" },
  });
  const blob = response.data as Blob;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folio}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
