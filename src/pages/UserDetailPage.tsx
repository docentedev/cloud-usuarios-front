import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Clock,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { Avatar } from "../components/ui/Avatar";
import { RoleBadge, StatusBadge } from "../components/ui/Badges";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { UserForm } from "../components/users/UserForm";
import { useUsers } from "../hooks/useUsers";
import { buttonStyles } from "../lib/ui";
import { formatDate, formatDateTime } from "../types/user";
import type { UserInput } from "../types/user";

interface UserDetailPageProps {
  id: string;
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

function InfoRow({ icon: Icon, label, value, href }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="truncate text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            {value}
          </a>
        ) : (
          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

export function UserDetailPage({ id }: UserDetailPageProps) {
  const { getUser, updateUser, deleteUser } = useUsers();
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const editing = new URLSearchParams(searchString).get("edit") === "1";
  const user = getUser(id);

  if (!user) {
    return (
      <Card>
        <EmptyState
          icon={<Users className="size-6" />}
          title="Usuario no encontrado"
          description="La cuenta que buscas no existe o fue eliminada."
          action={
            <Link
              href="/users"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              Volver a usuarios
            </Link>
          }
        />
      </Card>
    );
  }

  const handleSave = (values: UserInput) => {
    updateUser(user.id, values);
    navigate(`/user/detail/${user.id}`);
  };

  const handleDelete = () => {
    deleteUser(user.id);
    setConfirmOpen(false);
    navigate("/users");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft className="size-4" />
        Volver a usuarios
      </Link>

      <PageHeader
        title={editing ? "Editar usuario" : "Detalle del usuario"}
        description={
          editing
            ? "Actualiza los datos y permisos de la cuenta."
            : "Información completa de la cuenta seleccionada."
        }
        actions={
          editing ? null : (
            <>
              <Button
                variant="secondary"
                onClick={() => navigate(`/user/detail/${user.id}?edit=1`)}
              >
                <Pencil className="size-4" />
                Editar
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="size-4" />
                Eliminar
              </Button>
            </>
          )
        }
      />

      {editing ? (
        <Card className="max-w-3xl p-5 sm:p-6">
          <UserForm
            initial={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              department: user.department,
              role: user.role,
              status: user.status,
            }}
            submitLabel="Guardar cambios"
            onSubmit={handleSave}
            onCancel={() => navigate(`/user/detail/${user.id}`)}
          />
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar name={user.name} size="xl" />
                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </h2>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-5 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-slate-800">
                <InfoRow
                  icon={Mail}
                  label="Correo electrónico"
                  value={user.email}
                  href={`mailto:${user.email}`}
                />
                <InfoRow
                  icon={Phone}
                  label="Teléfono"
                  value={user.phone || "No registrado"}
                />
                <InfoRow
                  icon={Briefcase}
                  label="Departamento"
                  value={user.department}
                />
                <InfoRow
                  icon={ShieldCheck}
                  label="Rol de acceso"
                  value={user.role}
                />
              </div>
            </Card>
          </div>

          <Card className="h-fit p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Metadatos
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  ID de usuario
                </dt>
                <dd className="mt-1 truncate font-mono text-xs text-slate-700 dark:text-slate-300">
                  {user.id}
                </dd>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="size-4 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">
                  Creado el
                </span>
                <span className="ml-auto font-medium text-slate-900 dark:text-slate-100">
                  {formatDate(user.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">
                  Última actividad
                </span>
                <span className="ml-auto text-right font-medium text-slate-900 dark:text-slate-100">
                  {formatDateTime(user.lastActiveAt)}
                </span>
              </div>
            </dl>
          </Card>
        </div>
      )}

      <Modal
        open={confirmOpen}
        title="Eliminar usuario"
        description={`¿Seguro que quieres eliminar a ${user.name}? Esta acción no se puede deshacer.`}
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Eliminar usuario
            </Button>
          </>
        }
      />
    </div>
  );
}
