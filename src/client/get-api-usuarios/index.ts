import type { UsuariosResponse } from "./types";

const DIRECT_API_URL =
  "https://wznplg0ho7.execute-api.us-east-2.amazonaws.com/prod/api-usuarios/usuarios";

const envUrl = import.meta.env.VITE_API_USUARIOS_URL?.trim();

export const API_USUARIOS_URL = envUrl || DIRECT_API_URL;

export class UsuariosApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "UsuariosApiError";
    this.status = status;
  }
}

function messageForStatus(status: number, fallback: string): string {
  if (status === 401) {
    return "El JWT de Cognito no es válido o expiró. Vuelve a iniciar sesión.";
  }

  if (status === 403) {
    return "No tienes permisos para ver usuarios: tu cuenta debe pertenecer al grupo 'administrador' de Cognito.";
  }

  return fallback;
}

export const getApiUsuarios = async (
  token: string,
  signal?: AbortSignal,
): Promise<UsuariosResponse[]> => {
  const response = await fetch(API_USUARIOS_URL, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    signal,
  });

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const apiMessage =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message?: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Error ${response.status} ${response.statusText}`;

    throw new UsuariosApiError(
      messageForStatus(response.status, apiMessage),
      response.status,
    );
  }

  return (await response.json()) as UsuariosResponse[];
};
