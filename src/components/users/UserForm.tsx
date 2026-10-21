import { useState } from "react";
import type { FormEvent } from "react";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  USER_ROLES,
  USER_STATUSES,
} from "../../types/user";
import type { UserInput } from "../../types/user";
import { Button } from "../ui/Button";
import { FormSection, SelectField, TextField } from "../ui/Fields";

const DEFAULT_VALUES: UserInput = {
  name: "",
  email: "",
  phone: "",
  department: "",
  role: "viewer",
  status: "pending",
};

const ROLE_OPTIONS = USER_ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

const STATUS_OPTIONS = USER_STATUSES.map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

type FormErrors = Partial<Record<keyof UserInput, string>>;

function validate(values: UserInput): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 3) {
    errors.name = "Ingresa el nombre completo (mínimo 3 caracteres).";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (values.phone.trim() && values.phone.trim().length < 8) {
    errors.phone = "El teléfono debe tener al menos 8 caracteres.";
  }

  if (values.department.trim().length < 2) {
    errors.department = "Indica el área o departamento.";
  }

  return errors;
}

interface UserFormProps {
  initial?: UserInput;
  submitLabel: string;
  onSubmit: (values: UserInput) => void;
  onCancel?: () => void;
}

export function UserForm({
  initial = DEFAULT_VALUES,
  submitLabel,
  onSubmit,
  onCancel,
}: UserFormProps) {
  const [values, setValues] = useState<UserInput>(initial);
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = <K extends keyof UserInput>(
    field: K,
    value: UserInput[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    onSubmit({
      ...values,
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      department: values.department.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <FormSection
        title="Datos personales"
        description="Información básica para identificar al usuario."
      >
        <TextField
          label="Nombre completo"
          value={values.name}
          error={errors.name}
          autoComplete="name"
          placeholder="Camila Rojas"
          onChange={(event) => updateField("name", event.target.value)}
        />
        <TextField
          label="Correo electrónico"
          type="email"
          value={values.email}
          error={errors.email}
          autoComplete="email"
          placeholder="camila.rojas@empresa.cl"
          onChange={(event) => updateField("email", event.target.value)}
        />
      </FormSection>

      <FormSection
        title="Contacto"
        description="Datos opcionales de contacto y área de trabajo."
      >
        <TextField
          label="Teléfono"
          type="tel"
          value={values.phone}
          error={errors.phone}
          autoComplete="tel"
          placeholder="+56 9 1234 5678"
          hint="Opcional"
          onChange={(event) => updateField("phone", event.target.value)}
        />
        <TextField
          label="Departamento"
          value={values.department}
          error={errors.department}
          placeholder="Ingeniería"
          onChange={(event) => updateField("department", event.target.value)}
        />
      </FormSection>

      <FormSection
        title="Permisos"
        description="Define el nivel de acceso y el estado de la cuenta."
      >
        <SelectField
          label="Rol"
          value={values.role}
          options={ROLE_OPTIONS}
          onChange={(event) =>
            updateField("role", event.target.value as UserInput["role"])
          }
        />
        <SelectField
          label="Estado"
          value={values.status}
          options={STATUS_OPTIONS}
          onChange={(event) =>
            updateField("status", event.target.value as UserInput["status"])
          }
        />
      </FormSection>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-800">
        {onCancel ? (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
