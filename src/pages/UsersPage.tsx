import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Plus,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import { Link, useLocation, useSearch } from "wouter";
import { mapUsuario } from "../client/get-api-usuarios/mapper";
import { useGetUsuarios } from "../client/get-api-usuarios/useGetApiUsuarios";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { SearchField } from "../components/ui/SearchField";
import { UserTable } from "../components/users/UserTable";
import { buttonStyles, filterSelectStyles } from "../lib/ui";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  USER_ROLES,
  USER_STATUSES,
} from "../types/user";
import type { UserRole, UserStatus } from "../types/user";

const PAGE_SIZE = 6;

type RoleFilter = "all" | UserRole;
type StatusFilter = "all" | UserStatus;

function LoadingRows() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="divide-y divide-slate-100 dark:divide-slate-800"
    >
      <span className="sr-only">Cargando usuarios...</span>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-5 py-4">
          <div className="size-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-56 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="hidden h-6 w-20 animate-pulse rounded-full bg-slate-100 sm:block dark:bg-slate-800/60" />
        </div>
      ))}
    </div>
  );
}

export function UsersPage() {
  const { data: usuarios, error, loading, refetch } = useGetUsuarios();
  console.log("Usuarios:", usuarios);

  const searchString = useSearch();
  const [, navigate] = useLocation();
  const query = useMemo(
    () => new URLSearchParams(searchString).get("q") ?? "",
    [searchString],
  );

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);

  const updateQuery = (value: string) => {
    setPage(1);
    navigate(
      value.trim() ? `/users?q=${encodeURIComponent(value)}` : "/users",
      { replace: true },
    );
  };

  const updateRoleFilter = (value: RoleFilter) => {
    setPage(1);
    setRoleFilter(value);
  };

  const updateStatusFilter = (value: StatusFilter) => {
    setPage(1);
    setStatusFilter(value);
  };

  const users = useMemo(
    () => (usuarios ?? []).map(mapUsuario),
    [usuarios],
  );

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();

    return users.filter((user) => {
      const matchesTerm =
        term === "" ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.department.toLowerCase().includes(term);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesTerm && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const hasFilters =
    query.trim() !== "" || roleFilter !== "all" || statusFilter !== "all";
  const isInitialLoading = loading && !usuarios;

  const clearFilters = () => {
    setPage(1);
    setRoleFilter("all");
    setStatusFilter("all");
    navigate("/users", { replace: true });
  };

  const renderContent = () => {
    if (error) {
      return (
        <div
          role="alert"
          className="flex flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
            <CircleAlert className="size-5" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              No se pudieron cargar los usuarios
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {error.message}
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={refetch}>
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
        </div>
      );
    }

    if (isInitialLoading) {
      return <LoadingRows />;
    }

    return (
      <UserTable
        users={visibleUsers}
        emptyAction={
          hasFilters ? (
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          ) : (
            <Link
              href="/user/create"
              className={buttonStyles({ variant: "primary", size: "md" })}
            >
              <Plus className="size-4" />
              Crear el primer usuario
            </Link>
          )
        }
      />
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestión de usuarios"
        description="Administra cuentas, roles y estados de acceso."
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

      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchField
            label="Buscar usuarios"
            value={query}
            onChange={updateQuery}
            placeholder="Buscar por nombre, correo o área..."
            className="lg:max-w-sm lg:flex-1"
          />

          <div className="flex flex-1 flex-wrap items-center gap-2 lg:justify-end">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                aria-hidden="true"
                className="size-4 text-slate-400"
              />
              <select
                aria-label="Filtrar por rol"
                value={roleFilter}
                onChange={(event) =>
                  updateRoleFilter(event.target.value as RoleFilter)
                }
                className={filterSelectStyles}
              >
                <option value="all">Todos los roles</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>

            <select
              aria-label="Filtrar por estado"
              value={statusFilter}
              onChange={(event) =>
                updateStatusFilter(event.target.value as StatusFilter)
              }
              className={filterSelectStyles}
            >
              <option value="all">Todos los estados</option>
              {USER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>

            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isInitialLoading
                ? "Cargando usuarios..."
                : `${filteredUsers.length} ${
                    filteredUsers.length === 1 ? "usuario" : "usuarios"
                  }`}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hasFilters
                ? "Resultados según la búsqueda y los filtros aplicados"
                : "Todas las cuentas de la organización"}
            </p>
          </div>
          <span className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
            Página {currentPage} de {totalPages}
          </span>
        </div>

        {renderContent()}

        {!error && filteredUsers.length > PAGE_SIZE ? (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} de{" "}
              {filteredUsers.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
