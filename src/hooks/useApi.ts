/**
 * Archivo: src/hooks/useApi.ts
 *
 * Hook genérico para llamadas a la API con manejo de estados.
 * Elimina la necesidad de repetir useState/isLoading/isError en cada componente.
 *
 * Uso:
 *   const { data, isLoading, error, execute } = useApi(
 *     () => api.get("/contracts").then(r => r.data.data),
 *   )
 *
 *   También con ejecución manual:
 *   const { execute, isLoading } = useApi(fn, { auto: false })
 *   useEffect(() => { execute() }, [])
 */

import { useState, useCallback } from "react";
import {
  ApiError,
  NetworkError,
  AuthError,
  ValidationError,
} from "@/lib/errors";

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  /** Error tipado para manejo avanzado (status code, fields, etc.) */
  apiError: ApiError | NetworkError | null;
}

interface UseApiOptions {
  /** Si true, ejecuta la función inmediatamente (default: true) */
  auto?: boolean;
}

type ApiFn<T> = () => Promise<T>;

/**
 * Hook genérico para llamadas API con estados de carga y error.
 *
 * @param fn - Función asíncrona que hace la llamada API
 * @param options - Opciones de configuración
 * @returns Estado y controladores
 */
export function useApi<T>(fn: ApiFn<T>, options: UseApiOptions = {}) {
  const { auto = true } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: auto,
    error: null,
    apiError: null,
  });

  const execute = useCallback(async (): Promise<T | null> => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      apiError: null,
    }));

    try {
      const data = await fn();
      setState({ data, isLoading: false, error: null, apiError: null });
      return data;
    } catch (err: unknown) {
      let message = "Ocurrió un error inesperado";
      let apiError: ApiError | NetworkError | null = null;

      if (err instanceof ValidationError) {
        const firstField = Object.keys(err.fields)[0];
        message = firstField
          ? `${firstField}: ${err.fields[firstField][0]}`
          : err.message;
        apiError = err;
      } else if (err instanceof AuthError) {
        message = err.message;
        apiError = err;
      } else if (err instanceof ApiError) {
        message = err.message;
        apiError = err;
      } else if (err instanceof NetworkError) {
        message = err.message;
        apiError = err;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setState({ data: null, isLoading: false, error: message, apiError });
      return null;
    }
  }, [fn]);

  return {
    ...state,
    execute,
  };
}
