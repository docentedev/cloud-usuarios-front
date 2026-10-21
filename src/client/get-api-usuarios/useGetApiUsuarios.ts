import { useCallback, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { getApiUsuarios } from ".";
import type { UsuariosResponse } from "./types";

export function useGetUsuarios() {
  const auth = useAuth();
  // El access token de Cognito incluye `cognito:groups`, que exige la API.
  const token = auth.user?.access_token ?? auth.user?.id_token ?? null;

  const [data, setData] = useState<UsuariosResponse[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(0);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const usuarios = await getApiUsuarios(token, controller.signal);
        if (!active) return;

        console.log("[useGetUsuarios] usuarios", usuarios);
        setData(usuarios);
      } catch (caught) {
        if (!active || controller.signal.aborted) return;

        console.error("[useGetUsuarios] error al obtener usuarios", caught);
        setError(caught instanceof Error ? caught : new Error("Error desconocido"));
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [token, requestId]);

  const refetch = useCallback(() => {
    setRequestId((current) => current + 1);
  }, []);

  return {
    data,
    error,
    loading,
    refetch,
    /** Alias retrocompatible con la versión anterior del hook. */
    fetchUsuarios: refetch,
  };
}
