import { Search } from "lucide-react";
import { cn } from "../../lib/cn";
import { inputStyles } from "../../lib/ui";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  className?: string;
}

export function SearchField({
  value,
  onChange,
  placeholder = "Buscar...",
  label,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={cn(inputStyles, "pl-9")}
      />
    </div>
  );
}
