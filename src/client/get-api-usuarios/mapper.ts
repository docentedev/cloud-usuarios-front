import type { User } from "../../types/user";
import type { UsuariosResponse } from "./types";

/** Adapta el usuario de la API al modelo que consume la UI. */
export function mapUsuario(usuario: UsuariosResponse): User {
  return {
    id: String(usuario.id),
    name: usuario.nombre,
    email: usuario.email,
    phone: usuario.telefono ?? "",
    department: usuario.departamento?.trim() || "Sin departamento",
    role: usuario.rol,
    status: usuario.estado,
    createdAt: usuario.creadoEn,
    lastActiveAt: usuario.ultimaActividad,
  };
}
