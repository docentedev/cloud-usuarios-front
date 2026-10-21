import { useAuth } from "react-oidc-context";
import { Route, Switch, Link } from "wouter";
import { SearchX } from "lucide-react";
import { AppLayout } from "./components/layout/AppLayout";
import { Card } from "./components/ui/Card";
import { EmptyState } from "./components/ui/EmptyState";
import { buttonStyles } from "./lib/ui";
import { LoginPage } from "./pages/LoginPage";
import { OverviewPage } from "./pages/OverviewPage";
import { UserCreatePage } from "./pages/UserCreatePage";
import { UserDetailPage } from "./pages/UserDetailPage";
import { UsersPage } from "./pages/UsersPage";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
        Cargando sesión...
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <Card>
      <EmptyState
        icon={<SearchX className="size-6" />}
        title="Página no encontrada"
        description="La ruta que intentaste abrir no existe en el panel."
        action={
          <Link
            href="/"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            Ir al resumen
          </Link>
        }
      />
    </Card>
  );
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <LoadingScreen />;
  }

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={OverviewPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/user/create" component={UserCreatePage} />
        <Route path="/user/detail/:id">
          {(params) => <UserDetailPage id={params.id} />}
        </Route>
        <Route component={NotFoundPage} />
      </Switch>
    </AppLayout>
  );
}

export default App;
