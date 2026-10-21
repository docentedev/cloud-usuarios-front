import { useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "wouter";
import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserRound } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { useTheme } from "../../hooks/useTheme";
import { useSignOut } from "../../hooks/useSignOut";
import { Avatar } from "../ui/Avatar";
import { cn } from "../../lib/cn";
import { inputStyles } from "../../lib/ui";

interface HeaderProps {
  onOpenSidebar: () => void;
}

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Nuevo usuario pendiente",
    detail: "Sebastián Vega espera aprobación.",
    time: "Hace 2 h",
  },
  {
    id: 2,
    title: "Rol actualizado",
    detail: "Matías Fuentes pasó a Editor.",
    time: "Ayer",
  },
  {
    id: 3,
    title: "Sesión de administrador",
    detail: "Ignacio Herrera inició sesión.",
    time: "Ayer",
  },
];

type OpenMenu = "notifications" | "profile" | null;

export function Header({ onOpenSidebar }: HeaderProps) {
  const [, navigate] = useLocation();
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();
  const signOut = useSignOut();
  const [menu, setMenu] = useState<OpenMenu>(null);
  const [query, setQuery] = useState("");

  const email = auth.user?.profile.email ?? "usuario@cloudusuarios.cl";
  const displayName =
    (auth.user?.profile.name as string | undefined) ??
    email.split("@")[0] ??
    "Usuario";

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/users?q=${encodeURIComponent(trimmed)}` : "/users");
    setMenu(null);
  };

  const closeMenu = () => setMenu(null);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <button
        type="button"
        onClick={onOpenSidebar}
        aria-label="Abrir menú"
        className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <Menu className="size-5" />
      </button>

      <form onSubmit={handleSearch} className="flex-1 sm:max-w-md">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar usuarios..."
            aria-label="Buscar usuarios"
            className={cn(inputStyles, "h-10 py-0 pl-9")}
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Notificaciones"
            aria-expanded={menu === "notifications"}
            onClick={() =>
              setMenu((current) =>
                current === "notifications" ? null : "notifications",
              )
            }
            className="relative rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {menu === "notifications" ? (
            <>
              <button
                type="button"
                aria-label="Cerrar notificaciones"
                className="fixed inset-0 z-30 cursor-default"
                onClick={closeMenu}
              />
              <div className="absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Notificaciones
                  </p>
                </div>
                <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
                  {NOTIFICATIONS.map((notification) => (
                    <li
                      key={notification.id}
                      className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {notification.detail}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        {notification.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>

        <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block dark:bg-slate-800" />

        <div className="relative">
          <button
            type="button"
            aria-expanded={menu === "profile"}
            onClick={() =>
              setMenu((current) => (current === "profile" ? null : "profile"))
            }
            className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Avatar name={displayName} size="sm" />
            <span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block dark:text-slate-200">
              {displayName}
            </span>
            <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
          </button>

          {menu === "profile" ? (
            <>
              <button
                type="button"
                aria-label="Cerrar menú de usuario"
                className="fixed inset-0 z-30 cursor-default"
                onClick={closeMenu}
              />
              <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                  <Avatar name={displayName} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {email}
                    </p>
                  </div>
                </div>
                <div className="p-1.5">
                  <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                    <UserRound className="size-4" />
                    Cuenta Cognito
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      void signOut();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
