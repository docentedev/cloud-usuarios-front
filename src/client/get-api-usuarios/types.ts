export type RolUsuario = "admin" | "editor" | "viewer";
export type EstadoUsuario = "active" | "pending" | "inactive";

/** Usuario tal como lo devuelve la API (`GET /api-usuarios/usuarios`). */
export interface UsuariosResponse {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  departamento: string | null;
  rol: RolUsuario;
  estado: EstadoUsuario;
  creadoEn: string;
  ultimaActividad: string | null;
}
