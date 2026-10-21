export type UserRole = "admin" | "editor" | "viewer";
export type UserStatus = "active" | "pending" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastActiveAt: string | null;
}

export type UserInput = Pick<
  User,
  "name" | "email" | "phone" | "department" | "role" | "status"
>;

export const USER_ROLES: readonly UserRole[] = ["admin", "editor", "viewer"];

export const USER_STATUSES: readonly UserStatus[] = [
  "active",
  "pending",
  "inactive",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  editor: "Editor",
  viewer: "Lector",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Activo",
  pending: "Pendiente",
  inactive: "Inactivo",
};

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatDate(value: string | null): string {
  if (!value) return "Sin actividad";

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string | null): string {
  if (!value) return "Sin actividad";

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
