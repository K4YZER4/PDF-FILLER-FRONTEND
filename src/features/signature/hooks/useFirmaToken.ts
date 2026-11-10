/** Hook para gestionar el flujo de firma digital desde el lado del cliente.
 *
 *  Responsabilidades:
 *    1. Obtener datos del contrato via GET /api/enlaces-firma/:token
 *    2. Enviar la firma via POST /api/enlaces-firma/:token/firmas
 *    3. Manejar estados: loading, error (token expirado/usado/no encontrado), success
 *
 *  Uso:
 *    const { contrato, pdfUrl, loading, error, firmar } = useFirmaToken(token) */
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { ApiError } from "@/lib/errors";
import type { SignatureContractData, FirmarResponse } from "../types";

type FirmaError = "expirado" | "usado" | "no_encontrado" | "conexion" | null;

export function useFirmaToken(token: string | undefined) {
  const [contrato, setContrato] = useState<SignatureContractData | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirmaError>(null);
  const [enviando, setEnviando] = useState(false);
  const [firmado, setFirmado] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("no_encontrado");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const { data } = await api.get(`/api/enlaces-firma/${token}`);
        if (cancelled) return;
        setContrato(data.contrato);
        setPdfUrl(data.pdfUrl);
      } catch (err: unknown) {
        if (cancelled) return;
        const status = err instanceof ApiError ? err.status : 0;
        const message = err instanceof Error ? err.message : "";
        if (status === 404) {
          setError("no_encontrado");
        } else if (status === 400) {
          if (message.toLowerCase().includes("expirado")) {
            setError("expirado");
          } else if (message.toLowerCase().includes("usado")) {
            setError("usado");
          } else {
            setError("no_encontrado");
          }
        } else {
          setError("conexion");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => { cancelled = true; };
  }, [token]);

  const reabrirFirma = useCallback(async (): Promise<{ link: string; token: string; expira: string } | null> => {
    if (!token) return null;
    try {
      const { data } = await api.post(`/api/enlaces-firma/${token}/reabrir`);
      return data;
    } catch {
      return null;
    }
  }, [token]);

  const firmar = useCallback(async (firmaBase64: string): Promise<boolean> => {
    if (!token) return false;
    setEnviando(true);

    try {
      const { data } = await api.post<FirmarResponse>(`/api/enlaces-firma/${token}/firmas`, {
        firmaBase64,
        aceptoTerminos: true,
      });
      if (data.success) {
        setFirmado(true);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setEnviando(false);
    }
  }, [token]);

  return { contrato, pdfUrl, loading, error, enviando, firmado, firmar, reabrirFirma };
}
