import { LogIn, ShieldCheck, Users, UserCheck, UserCog } from "lucide-react";
import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const FEATURES = [
  {
    icon: Users,
    title: "Directorio centralizado",
    detail: "Consulta y filtra todas las cuentas en un solo lugar.",
  },
  {
    icon: UserCog,
    title: "Roles y permisos",
    detail: "Define accesos de administrador, editor o lector.",
  },
  {
    icon: UserCheck,
    title: "Estados de cuenta",
    detail: "Controla altas pendientes, activas e inactivas.",
  },
];

export function LoginPage() {
  const auth = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <ShieldCheck className="size-6" />
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Cloud Usuarios
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Panel de administración de cuentas
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Inicia sesión
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Usa tu cuenta de Cognito para acceder al dashboard.
          </p>

          {auth.error ? (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
            >
              No pudimos iniciar sesión: {auth.error.message}
            </div>
          ) : null}

          <Button
            className="mt-6 w-full"
            size="md"
            onClick={() => void auth.signinRedirect()}
          >
            <LogIn className="size-4" />
            Continuar con Cognito
          </Button>

          <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
            Serás redirigido al Hosted UI de tu User Pool.
          </p>
        </Card>

        <ul className="mt-8 space-y-3">
          {FEATURES.map(({ icon: Icon, title, detail }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Icon className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {detail}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
