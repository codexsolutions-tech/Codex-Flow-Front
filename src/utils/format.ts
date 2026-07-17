export function onlyDigits(value?: string): string {
  return (value ?? "").replace(/\D/g, "");
}

export function formatDocument(value?: string): string {
  const d = onlyDigits(value);
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return value || "—";
}

export function formatDate(value?: Date | string): string {
  if (!value) return "—";
  const date = new Date(value);
  return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("pt-BR");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function getInitials(name?: string): string {
  return (
    (name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?"
  );
}

/** Percentual inteiro de `part` sobre `total` (0 quando total = 0). */
export function toPercent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}
