import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { UserForm } from "../components/users/UserForm";
import { useUsers } from "../hooks/useUsers";

export function UserCreatePage() {
  const { createUser } = useUsers();
  const [, navigate] = useLocation();

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
        title="Crear usuario"
        description="Completa los datos para dar de alta una nueva cuenta."
      />

      <Card className="max-w-3xl p-5 sm:p-6">
        <UserForm
          submitLabel="Crear usuario"
          onSubmit={(values) => {
            const user = createUser(values);
            navigate(`/user/detail/${user.id}`);
          }}
          onCancel={() => navigate("/users")}
        />
      </Card>
    </div>
  );
}
