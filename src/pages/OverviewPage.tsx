import {
  ArrowUpRight,
  Clock,
  Plus,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "react-oidc-context";
import { StatCard } from "../components/dashboard/StatCard";
import { Avatar } from "../components/ui/Avatar";
import { RoleBadge, StatusBadge } from "../components/ui/Badges";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { useUsers } from "../hooks/useUsers";
import { buttonStyles } from "../lib/ui";
import {
  ROLE_LABELS,
  USER_ROLES,
  formatDate,
  formatDateTime,
} from "../types/user";

export function OverviewPage() {
  const { users } = useUsers();
  const auth = useAuth();

  const active = users.filter((user) => user.status === "active").length;
  const pending = users.filter((user) => user.status === "pending").length;
  const inactive = users.filter((user) => user.status === "inactive").length;

  const roleCounts = USER_ROLES.map((role) => ({
    role,
    count: users.filter((user) => user.role === role).length,
  }));
  const maxRoleCount = Math.max(...roleCounts.map((item) => item.count), 1);

  const recentUsers = [...users]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const recentActivity = [...users]
    .filter((user) => user.lastActiveAt)
    .sort(
      (a, b) =>
        new Date(b.lastActiveAt ?? 0).getTime() -
        new Date(a.lastActiveAt ?? 0).getTime(),
    )
    .slice(0, 4);

  const email = auth.user?.profile.email ?? "";
  const displayName = email.split("@")[0] || "equipo";

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Hola, ${displayName}`}
        description="Este es el estado actual de las cuentas de tu organización."
        actions={
          <Link
            href="/user/create"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <Plus className="size-4" />
            Nuevo usuario
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Usuarios totales"
          value={users.length}
          hint="Cuentas registradas en la plataforma"
          icon={Users}
          tone="indigo"
        />
        <StatCard
          label="Activos"
          value={active}
          hint="Con acceso habilitado"
          icon={UserCheck}
          tone="emerald"
        />
        <StatCard
          label="Pendientes"
          value={pending}
          hint="Esperando aprobación"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Inactivos"
          value={inactive}
          hint="Sin actividad reciente"
          icon={UserX}
          tone="slate"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Usuarios recientes
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Últimas cuentas creadas
              </p>
            </div>
            <Link
              href="/users"
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Ver todos
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentUsers.map((user) => (
              <li key={user.id}>
                <Link
                  href={`/user/detail/${user.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <Avatar name={user.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                  <span className="hidden text-xs text-slate-400 md:block dark:text-slate-500">
                    {formatDate(user.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Distribución por rol
              </h2>
            </div>
            <ul className="mt-4 space-y-4">
              {roleCounts.map(({ role, count }) => (
                <li key={role}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      {ROLE_LABELS[role]}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {count}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400"
                      style={{ width: `${(count / maxRoleCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-slate-500 dark:text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Actividad reciente
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {recentActivity.map((user) => (
                <li key={user.id} className="flex items-start gap-3">
                  <Avatar name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{user.name}</span> inició
                      sesión
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {formatDateTime(user.lastActiveAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Accesos gestionados con Cognito
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Los roles y estados de esta vista son locales al panel; conéctalos
              a tu API para persistirlos.
            </p>
          </div>
        </div>
        <Link
          href="/user/create"
          className={buttonStyles({ variant: "secondary", size: "md" })}
        >
          <UserPlus className="size-4" />
          Invitar usuario
        </Link>
      </Card>
    </div>
  );
}
