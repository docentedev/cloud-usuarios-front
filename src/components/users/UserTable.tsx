import { Eye, Pencil, Trash2, Users } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { cn } from "../../lib/cn";
import { buttonStyles } from "../../lib/ui";
import { formatDate } from "../../types/user";
import type { User } from "../../types/user";
import { Avatar } from "../ui/Avatar";
import { RoleBadge, StatusBadge } from "../ui/Badges";
import { EmptyState } from "../ui/EmptyState";

interface UserTableProps {
  users: User[];
  onRequestDelete: (user: User) => void;
  emptyAction?: ReactNode;
}

export function UserTable({
  users,
  onRequestDelete,
  emptyAction,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="size-6" />}
        title="Sin usuarios para mostrar"
        description="Ajusta la búsqueda o los filtros para encontrar a la persona que buscas."
        action={emptyAction}
      />
    );
  }

  return (
    <>
      {/* Tabla (desktop) */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-slate-800 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">
                Usuario
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Rol
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Estado
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Departamento
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Última actividad
              </th>
              <th scope="col" className="px-6 py-3 text-right font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-6 py-3.5">
                  <Link
                    href={`/user/detail/${user.id}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar name={user.name} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                        {user.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                  {user.department}
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {formatDate(user.lastActiveAt)}
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/user/detail/${user.id}`}
                      aria-label={`Ver ${user.name}`}
                      title="Ver detalle"
                      className={cn(
                        buttonStyles({ variant: "ghost", size: "sm" }),
                        "px-2",
                      )}
                    >
                      <Eye className="size-4" />
                    </Link>
                    <Link
                      href={`/user/detail/${user.id}?edit=1`}
                      aria-label={`Editar ${user.name}`}
                      title="Editar"
                      className={cn(
                        buttonStyles({ variant: "ghost", size: "sm" }),
                        "px-2",
                      )}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onRequestDelete(user)}
                      aria-label={`Eliminar ${user.name}`}
                      title="Eliminar"
                      className={cn(
                        buttonStyles({ variant: "ghost", size: "sm" }),
                        "px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10",
                      )}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas (mobile) */}
      <ul className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
        {users.map((user) => (
          <li key={user.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar name={user.name} size="md" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/user/detail/${user.id}`}
                  className="block truncate font-medium text-slate-900 dark:text-slate-100"
                >
                  {user.name}
                </Link>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {user.department} · {formatDate(user.lastActiveAt)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/user/detail/${user.id}`}
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                  >
                    <Eye className="size-3.5" />
                    Ver
                  </Link>
                  <Link
                    href={`/user/detail/${user.id}?edit=1`}
                    className={buttonStyles({ variant: "secondary", size: "sm" })}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => onRequestDelete(user)}
                    className={cn(
                      buttonStyles({ variant: "ghost", size: "sm" }),
                      "ml-auto text-rose-600 dark:text-rose-400",
                    )}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Eliminar {user.name}</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
