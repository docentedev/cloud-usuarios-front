import { cn } from "../../lib/cn";
import { ROLE_LABELS, STATUS_LABELS } from "../../types/user";
import type { UserRole, UserStatus } from "../../types/user";

const ROLE_STYLES: Record<UserRole, string> = {
  admin:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/10 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20",
  editor:
    "bg-violet-50 text-violet-700 ring-violet-600/10 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
  viewer:
    "bg-slate-100 text-slate-600 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-400/20",
};

const STATUS_STYLES: Record<UserStatus, string> = {
  active:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/10 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  pending:
    "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  inactive:
    "bg-slate-100 text-slate-500 ring-slate-500/10 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-400/20",
};

const DOT_STYLES: Record<UserStatus, string> = {
  active: "bg-emerald-500",
  pending: "bg-amber-500",
  inactive: "bg-slate-400",
};

const BASE =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span className={cn(BASE, ROLE_STYLES[role], className)}>
      {ROLE_LABELS[role]}
    </span>
  );
}

interface StatusBadgeProps {
  status: UserStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(BASE, STATUS_STYLES[status], className)}>
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", DOT_STYLES[status])}
      />
      {STATUS_LABELS[status]}
    </span>
  );
}
