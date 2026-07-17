import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";

export type Tone = "accent" | "success" | "warning" | "danger" | "neutral";

const toneText: Record<Tone, string> = {
  accent: "text-accent-soft",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  neutral: "text-mist",
};

const toneChip: Record<Tone, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent-soft",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  neutral: "border-white/10 bg-white/[0.06] text-mist",
};

export function PageHeader({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  children?: ReactNode; // ações à direita
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent-soft">
          {icon}
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-mist">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

/* ═══ Button ═══ */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "success" | "warning" | "danger";
  size?: "sm" | "md";
  icon?: ReactNode;
};

export function Button({ variant = "primary", size = "md", icon, children, className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-accent text-white hover:bg-[#6a5ce0]",
    ghost: "border border-white/10 bg-white/[0.04] text-mist hover:bg-white/[0.08] hover:text-ink",
    success: "border border-success/30 bg-success/10 text-success hover:bg-success/20",
    warning: "border border-warning/30 bg-warning/10 text-warning hover:bg-warning/20",
    danger: "border border-danger/30 bg-danger/10 text-danger hover:bg-danger/20",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ═══ Badge ═══ */
export function Badge({ tone = "neutral", icon, children }: { tone?: Tone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${toneChip[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}

/* ═══ KpiCard ═══ */
export function KpiCard({
  icon,
  label,
  value,
  hint,
  tone = "accent",
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border bg-surface p-4">
      <div className="flex items-center gap-2">
        <span className={toneText[tone]}>{icon}</span>
        <span className="text-xs font-medium text-mist">{label}</span>
      </div>
      <p className={`nums text-xl font-semibold ${toneText[tone]}`}>{value}</p>
      {hint && <p className="text-xs text-faint">{hint}</p>}
    </div>
  );
}

/* ═══ SectionCard ═══ */
export function SectionCard({
  title,
  icon,
  actions,
  children,
  className = "",
  bodyClassName = "",
}: {
  title?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`flex flex-col overflow-hidden rounded-xl border bg-surface ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold">
            {icon}
            {title}
          </p>
          {actions}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

/* ═══ Field / SelectField ═══ */
export function Field({
  label,
  icon,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-mist">{label}</label>
      <div className="relative">
        <input
          {...props}
          className={`w-full rounded-lg border bg-white/[0.05] py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent ${
            icon ? "pl-9 pr-3" : "px-3"
          }`}
        />
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-faint">{icon}</span>
        )}
      </div>
      {hint && <span className="text-xs text-faint">{hint}</span>}
    </div>
  );
}

export function SelectField({
  label,
  icon,
  options,
  placeholder = "Selecionar…",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  icon?: ReactNode;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-mist">{label}</label>}
      <div className="relative">
        <select
          {...props}
          className={`w-full cursor-pointer appearance-none rounded-lg border bg-white/[0.05] py-2.5 pr-9 text-sm text-ink outline-none transition-colors focus:border-accent [&>option]:bg-surface ${
            icon ? "pl-9" : "pl-3"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex -translate-y-1/2 text-faint">
            {icon}
          </span>
        )}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-faint">▼</span>
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-white/[0.04] px-3.5 transition-colors focus-within:border-accent/60 ${className}`}
    >
      <Search size={15} className="flex-shrink-0 text-faint" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-faint"
      />
      {value && (
        <button onClick={() => onChange("")} className="flex text-faint transition-colors hover:text-accent-soft">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

/* ═══ Tabs ═══ */
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: T; label: string; icon?: ReactNode }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <div className="flex overflow-x-auto">
      {tabs.map(({ id, label, icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
            active === id ? "border-accent text-accent-soft" : "border-transparent text-mist hover:text-ink"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}

/* ═══ FilterPills ═══ */
export function FilterPills<T extends string>({
  options,
  active,
  onChange,
}: {
  options: readonly T[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`rounded-lg px-3.5 py-2 text-xs font-medium capitalize transition-colors ${
            active === s ? "bg-accent text-white" : "border bg-white/[0.04] text-mist hover:bg-white/[0.08]"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/* ═══ Pagination ═══ */
export function Pagination({
  page,
  totalPages,
  onChange,
  summary,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
  summary?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {summary && <span className="text-xs text-faint">{summary}</span>}
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={13} /> Anterior
        </Button>
        <span className="nums px-2 text-xs text-mist">
          {page} / {totalPages}
        </span>
        <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
          Próxima <ChevronRight size={13} />
        </Button>
      </div>
    </div>
  );
}

/* ═══ EmptyState ═══ */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border bg-white/[0.04] text-accent-soft">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="mt-1 text-sm text-mist">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ═══ Avatar (iniciais) ═══ */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const iniciais =
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";
  const sizes = { sm: "h-8 w-8 text-[11px]", md: "h-10 w-10 text-xs" };
  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/15 font-semibold text-accent-soft ${sizes[size]}`}
    >
      {iniciais}
    </div>
  );
}
