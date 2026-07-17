// src/pages/Clientes/CustomerDetailPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  BadgeCheck,
  CheckCircle,
  UserPlus2,
  AlertTriangle,
  Pencil,
  Trash2,
  DollarSign,
  Wallet,
  ShoppingCart,
  TrendingUp,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  XCircle,
  Users,
  LayoutDashboard,
  FileText,
  History,
  CalendarDays,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/date";
import CustomerService from "../../services/Client.Service";
import NoteService from "../../services/Note.Service";
import { Modal } from "../../components/Modals/Modal";
import Invoice from "../../components/Invoice/Invoice";
import CustomerType, { eStatus } from "../../types/ClientType";
import { PedidoClienteType } from "../../types/InvoiceType";

/* ═══════════════════════════════════════════════════════════════════
   1 · DESIGN TOKENS
═══════════════════════════════════════════════════════════════════ */

const C = {
  accent: "#7c6ef5",
  accentSoft: "#9b8ff5",
  green: "#5dcaa5",
  amber: "#fac775",
  red: "#f09595",
  purple: "#c084fc",
  muted: "#8a85b4",
  faint: "#6b66a0",
  border: "rgba(255,255,255,0.08)",
};

const T = {
  h1: "text-[15px] font-bold text-[#ece9ff] leading-tight",
  section: "text-[13px] font-semibold text-[#ece9ff]",
  label: "text-[11px] font-semibold uppercase tracking-[0.06em] text-[#6b66a0]",
  body: "text-[13px] text-[#b9b4de]",
  meta: "text-xs text-[#8a85b4]",
  cell: "text-xs tabular-nums",
};

const card = "bg-[#15132a] border border-white/[0.08] rounded-xl";

const btn = {
  ghost:
    "flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#8a85b4] transition-colors hover:bg-white/[0.06] hover:text-[#cfcbee]",
  primary:
    "flex items-center justify-center gap-1.5 rounded-lg bg-[#7c6ef5] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#8d80f7] disabled:opacity-60",
  accent:
    "flex items-center justify-center gap-1.5 rounded-lg border border-[#7c6ef5]/25 bg-[#7c6ef5]/[0.12] px-3 py-2 text-xs font-medium text-[#9b8ff5] transition-colors hover:bg-[#7c6ef5]/[0.2]",
  danger:
    "flex items-center justify-center gap-1.5 rounded-lg border border-[#e24b4a]/25 bg-[#a22d2d]/25 px-3 py-2 text-xs font-semibold text-[#f09595] transition-colors hover:bg-[#a22d2d]/40 disabled:opacity-60",
};

const input =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-[13px] text-[#ece9ff] outline-none transition-colors placeholder:text-[#5a5588] focus:border-[#7c6ef5]/60 focus:bg-white/[0.07]";

const tones: Record<string, string> = {
  green: "bg-[#0f6e56]/30 text-[#5dcaa5] border-[#5dcaa5]/25",
  amber: "bg-[#ba7517]/25 text-[#fac775] border-[#fac775]/25",
  red: "bg-[#a22d2d]/25 text-[#f09595] border-[#e24b4a]/25",
  purple: "bg-[#a855f7]/[0.14] text-[#c084fc] border-[#c084fc]/25",
  muted: "bg-[#8a85b4]/[0.12] text-[#8a85b4] border-[#8a85b4]/25",
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const TABS = [
  { id: "overview", label: "Visão geral", Icon: LayoutDashboard },
  { id: "notas", label: "Notas", Icon: FileText },
  { id: "historico", label: "Histórico", Icon: History },
] as const;

const axis = { tick: { fontSize: 11, fill: C.faint }, axisLine: false, tickLine: false } as const;
const moneyAxis = (v: number) => (Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v));

/* ═══════════════════════════════════════════════════════════════════
   2 · HELPERS
═══════════════════════════════════════════════════════════════════ */

const n = (v: any) => Number(v) || 0;

const estaFechado = (v: PedidoClienteType) => v.pedido.pedidoStatus === "FECHADO";
const estaAberto = (v: PedidoClienteType) => v.pedido.pedidoStatus === "ABERTO";
const estaCancelado = (v: PedidoClienteType) => v.pedido.pedidoStatus === "CANCELADO";

// totalPedido pronto da API; se vier zerado, recalcula pelos itens
const totalDoPedido = (v: PedidoClienteType) =>
  n(v.pedido.totalPedido) ||
  (v.pedido.itensPedido ?? []).reduce((acc, item) => acc + n(item.valorVendaItem) * n(item.quantidadeItem), 0);

const pagoDoPedido = (v: PedidoClienteType) => (estaFechado(v) ? totalDoPedido(v) : 0);

const avatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c6ef5&color=fff&bold=true`;

function formatDoc(v?: string) {
  const d = (v || "").replace(/\D/g, "");
  if (d.length === 11) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  if (d.length === 14) return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  return v || "—";
}

function classify(total: number) {
  if (total >= 10000) return { tone: "amber", label: "VIP", Icon: Star };
  if (total >= 3000) return { tone: "purple", label: "Premium", Icon: BadgeCheck };
  if (total >= 500) return { tone: "green", label: "Regular", Icon: CheckCircle };
  return { tone: "muted", label: "Novo", Icon: UserPlus2 };
}

/* ═══════════════════════════════════════════════════════════════════
   3 · COMPONENTES BASE
═══════════════════════════════════════════════════════════════════ */

function Section({
  title,
  Icon,
  action,
  children,
}: {
  title: string;
  Icon: any;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2.5">
      <header className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#7c6ef5]/[0.12] text-[#9b8ff5]">
            <Icon size={12} />
          </span>
          <h2 className={`${T.section} m-0 truncate`}>{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

const Badge = ({ tone, Icon, children }: { tone: string; Icon: any; children: React.ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2 py-[3px] text-[10px] font-semibold ${tones[tone]}`}
  >
    <Icon size={10} /> {children}
  </span>
);

function KPI({
  Icon,
  label,
  value,
  sub,
  color = C.accentSoft,
}: {
  Icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className={`${card} flex min-w-0 flex-col gap-1.5 px-3.5 py-3`}>
      <div className="flex items-center gap-1.5">
        <span
          className="grid h-5 w-5 shrink-0 place-items-center rounded-md"
          style={{ background: `${color}1a`, color }}
        >
          <Icon size={11} />
        </span>
        <span className={`${T.label} truncate`}>{label}</span>
      </div>
      <p className="m-0 truncate text-lg font-bold tabular-nums" style={{ color }}>
        {value}
      </p>
      {sub && <p className="m-0 text-[11px] text-[#6b66a0]">{sub}</p>}
    </div>
  );
}

function ChartCard({
  title,
  height = 160,
  legend,
  children,
}: {
  title: string;
  height?: number;
  legend?: React.ReactNode;
  children: React.ReactElement;
}) {
  return (
    <div className={`${card} p-4`}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className={`${T.section} m-0`}>{title}</p>
        {legend}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

const ChartLegend = ({ items }: { items: { color: string; label: string }[] }) => (
  <div className="flex items-center gap-3">
    {items.map((it) => (
      <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-[#8a85b4]">
        <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
        {it.label}
      </span>
    ))}
  </div>
);

const ChartTooltip = ({ active, payload, label, money, suffix }: any) =>
  !active || !payload?.length ? null : (
    <div className="rounded-lg border border-white/[0.14] bg-[#1a1733] px-3 py-2 text-xs shadow-xl">
      <p className="m-0 mb-1 text-[#8a85b4]">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="m-0 mt-0.5" style={{ color: p.color }}>
          {p.name}:{" "}
          <strong className="tabular-nums">{money ? formatCurrency(n(p.value)) : `${p.value}${suffix ?? ""}`}</strong>
        </p>
      ))}
    </div>
  );

const NoteStatusBadge = ({ v }: { v: PedidoClienteType }) => {
  if (estaFechado(v))
    return (
      <Badge tone="green" Icon={CheckCircle}>
        Pago
      </Badge>
    );
  if (estaCancelado(v))
    return (
      <Badge tone="muted" Icon={XCircle}>
        Cancelado
      </Badge>
    );
  return (
    <Badge tone="red" Icon={AlertCircle}>
      Pendente
    </Badge>
  );
};

const Empty = ({ Icon, text }: { Icon: any; text: string }) => (
  <div className="flex flex-col items-center gap-2 py-10 text-[#6b66a0]">
    <Icon size={22} />
    <p className="m-0 text-[13px]">{text}</p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   4 · MODAIS (usando o <Modal> do projeto)
═══════════════════════════════════════════════════════════════════ */

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label className={T.label}>{label}</label>
    {children}
  </div>
);

function EditModal({
  open,
  customer,
  onClose,
  onSaved,
}: {
  open: boolean;
  customer: CustomerType;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    nome: customer.nome || "",
    cpfCnpj: customer.cpfCnpj || "",
    status: customer.status,
  });
  const [saving, setSaving] = useState(false);

  // Sincroniza o form quando o customer mudar (após save/reload)
  useEffect(() => {
    setForm({
      nome: customer.nome || "",
      cpfCnpj: customer.cpfCnpj || "",
      status: customer.status,
    });
  }, [customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.id) return;
    setSaving(true);
    try {
      await CustomerService.update(String(customer.id), {
        nome: form.nome.trim(),
        cpfCnpj: form.cpfCnpj.replace(/\D/g, ""),
        status: form.status,
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar cliente"
      subtitle={`#${customer.id} — ${customer.nome}`}
      size="md"
    >
      <form onSubmit={handleSave} className="flex flex-col gap-3.5">
        <Field label="Nome">
          <input
            value={form.nome}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            placeholder="Nome completo"
            className={input}
          />
        </Field>
        <Field label="CPF / CNPJ">
          <input
            value={form.cpfCnpj}
            inputMode="numeric"
            onChange={(e) => setForm((f) => ({ ...f, cpfCnpj: e.target.value }))}
            placeholder="Somente números"
            className={input}
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as eStatus }))}
            className={`${input} cursor-pointer [&>option]:bg-[#15132a]`}
          >
            <option value={eStatus.ATIVO}>Ativo</option>
            <option value={eStatus.INATIVO}>Inativo</option>
          </select>
        </Field>
        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onClose} className={`${btn.ghost} flex-1 py-2.5`}>
            Cancelar
          </button>
          <button type="submit" disabled={saving} className={`${btn.primary} flex-[2] py-2.5`}>
            {saving ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteModal({
  open,
  customer,
  onClose,
  onDeleted,
}: {
  open: boolean;
  customer: CustomerType;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!customer.id) return;
    setDeleting(true);
    try {
      await CustomerService.remove(String(customer.id));
      onDeleted();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Excluir cliente" subtitle="Essa ação não pode ser desfeita" size="md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e24b4a]/25 bg-[#a22d2d]/25 px-3.5 py-3">
          <AlertTriangle size={16} className="mt-px shrink-0 text-[#f09595]" />
          <div>
            <p className="m-0 text-[13px] font-medium text-[#ece9ff]">
              Você está excluindo <strong>{customer.nome}</strong>
            </p>
            <p className={`${T.meta} m-0 mt-1`}>Todos os dados deste cliente serão removidos permanentemente.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className={`${btn.ghost} flex-1 py-2.5`}>
            Cancelar
          </button>
          <button onClick={handleDelete} disabled={deleting} className={`${btn.danger} flex-[2] py-2.5`}>
            <Trash2 size={13} /> {deleting ? "Excluindo…" : "Confirmar exclusão"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   5 · ABAS
═══════════════════════════════════════════════════════════════════ */

function TabOverview({ pedidos }: { pedidos: PedidoClienteType[] }) {
  const now = new Date();

  const validos = pedidos.filter((p) => !estaCancelado(p));
  const doMes = validos.filter((p) => {
    const d = new Date(p.pedido.dataPedido);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalFat = validos.reduce((s, x) => s + totalDoPedido(x), 0);
  const totalRec = validos.reduce((s, x) => s + pagoDoPedido(x), 0);
  const totalMes = doMes.reduce((s, x) => s + totalDoPedido(x), 0);
  const emAberto = totalFat - totalRec;

  const monthly = MONTHS.map((m, i) => {
    const ms = validos.filter((x) => new Date(x.pedido.dataPedido).getMonth() === i);
    return {
      name: m,
      faturado: ms.reduce((s, x) => s + totalDoPedido(x), 0),
      recebido: ms.reduce((s, x) => s + pagoDoPedido(x), 0),
    };
  });

  const noteGrowth = [...validos]
    .sort((a, b) => new Date(a.pedido.dataPedido).getTime() - new Date(b.pedido.dataPedido).getTime())
    .map((x, i, arr) => {
      const prev = arr[i - 1];
      const cur = totalDoPedido(x);
      const prevTotal = prev ? totalDoPedido(prev) : 0;
      const delta = prev ? ((cur - prevTotal) / (prevTotal || 1)) * 100 : 0;
      return { name: `#${i + 1}`, delta: Math.round(delta) };
    });

  return (
    <div className="flex flex-col gap-6">
      <Section title="Indicadores" Icon={TrendingUp}>
        <div className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
          <KPI
            Icon={DollarSign}
            label="Faturado no mês"
            value={formatCurrency(totalMes)}
            sub={`${doMes.length} nota${doMes.length !== 1 ? "s" : ""} este mês`}
          />
          <KPI
            Icon={Wallet}
            label="Total recebido"
            value={formatCurrency(totalRec)}
            color={C.green}
            sub={`${totalFat ? Math.round((totalRec / totalFat) * 100) : 0}% do faturado`}
          />
          <KPI
            Icon={AlertCircle}
            label="A receber"
            value={formatCurrency(emAberto)}
            color={emAberto > 0 ? C.amber : C.green}
            sub="Saldo em aberto"
          />
          <KPI
            Icon={ShoppingCart}
            label="Total de notas"
            value={validos.length}
            sub={`Faturamento total: ${formatCurrency(totalFat)}`}
          />
        </div>
      </Section>

      <Section title="Desempenho financeiro" Icon={BarChart2}>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <ChartCard
            title="Faturamento × recebimento por mês"
            height={180}
            legend={
              <ChartLegend
                items={[
                  { color: C.accent, label: "Faturado" },
                  { color: C.green, label: "Recebido" },
                ]}
              />
            }
          >
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.accent} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.green} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} tickFormatter={moneyAxis} width={36} />
              <Tooltip content={<ChartTooltip money />} />
              <Area
                type="monotone"
                dataKey="faturado"
                name="Faturado"
                stroke={C.accent}
                strokeWidth={2}
                fill="url(#gF)"
              />
              <Area
                type="monotone"
                dataKey="recebido"
                name="Recebido"
                stroke={C.green}
                strokeWidth={2}
                fill="url(#gR)"
              />
            </AreaChart>
          </ChartCard>

          <ChartCard title="Crescimento nota a nota" height={180}>
            <BarChart data={noteGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" {...axis} />
              <YAxis {...axis} tickFormatter={(v) => `${v}%`} width={36} />
              <Tooltip content={<ChartTooltip suffix="%" />} />
              <Bar dataKey="delta" name="Crescimento" radius={[4, 4, 0, 0]}>
                {noteGrowth.map((d, i) => (
                  <Cell key={i} fill={d.delta >= 0 ? C.green : C.red} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ChartCard>
        </div>
      </Section>
    </div>
  );
}

function TabNotas({ pedidos, onAbrir }: { pedidos: PedidoClienteType[]; onAbrir: (v: PedidoClienteType) => void }) {
  const [page, setPage] = useState(1);
  const PAGE = 8;
  const sorted = useMemo(
    () =>
      [...pedidos].sort((a, b) => new Date(b.pedido.dataPedido).getTime() - new Date(a.pedido.dataPedido).getTime()),
    [pedidos],
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const items = sorted.slice((page - 1) * PAGE, page * PAGE);
  const cols = "grid-cols-[1fr_92px_100px_100px_100px_72px]";

  return (
    <Section
      title="Notas do cliente"
      Icon={FileText}
      action={
        <span className={T.meta}>
          {pedidos.length} registro{pedidos.length !== 1 ? "s" : ""}
        </span>
      }
    >
      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className={`grid ${cols} gap-2 border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5`}>
              {["Data", "Status", "Total", "Pago", "Saldo", "Nº"].map((h) => (
                <span key={h} className={T.label}>
                  {h}
                </span>
              ))}
            </div>

            {items.length === 0 ? (
              <Empty Icon={FileText} text="Nenhuma nota registrada" />
            ) : (
              items.map((v) => {
                const total = totalDoPedido(v);
                const pago = pagoDoPedido(v);
                const saldo = total - pago;
                const idCurto = v.pedido.pedidoId?.slice(-6).toUpperCase() ?? "—";
                return (
                  <button
                    key={v.pedido.pedidoId}
                    onClick={() => onAbrir(v)}
                    className={`grid w-full ${cols} items-center gap-2 border-b border-white/[0.04] px-4 py-2.5 text-left transition-colors last:border-0 hover:bg-white/[0.04]`}
                  >
                    <span className={`${T.cell} text-[#8a85b4]`}>{formatDate(v.pedido.dataPedido)}</span>
                    <NoteStatusBadge v={v} />
                    <span className={`${T.cell} text-[#ece9ff]`}>{formatCurrency(total)}</span>
                    <span className={`${T.cell} ${pago > 0 ? "text-[#5dcaa5]" : "text-[#4e4a72]"}`}>
                      {formatCurrency(pago)}
                    </span>
                    <span className={`${T.cell} ${saldo > 0 ? "text-[#f09595]" : "text-[#5dcaa5]"}`}>
                      {formatCurrency(saldo)}
                    </span>
                    <span className="text-right font-mono text-[10px] text-[#6b66a0]">#{idCurto}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.01] px-4 py-2.5">
            <span className="text-[11px] text-[#6b66a0]">
              Página {page} de {totalPages}
            </span>
            <div className="flex gap-1.5">
              {[
                { dir: -1, Icon: ChevronLeft, disabled: page <= 1 },
                { dir: 1, Icon: ChevronRight, disabled: page >= totalPages },
              ].map(({ dir, Icon, disabled }) => (
                <button
                  key={dir}
                  disabled={disabled}
                  onClick={() => setPage((p) => p + dir)}
                  className="flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[#8a85b4] transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:text-[#4e4a72] disabled:hover:bg-white/[0.04]"
                >
                  <Icon size={11} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function TabHistorico({ pedidos }: { pedidos: PedidoClienteType[] }) {
  const validos = pedidos.filter((p) => !estaCancelado(p));

  const monthly = MONTHS.map((m, i) => {
    const ms = validos.filter((x) => new Date(x.pedido.dataPedido).getMonth() === i);
    const fat = ms.reduce((s, x) => s + totalDoPedido(x), 0);
    const rec = ms.reduce((s, x) => s + pagoDoPedido(x), 0);
    return { name: m, vendas: ms.length, faturado: fat, recebido: rec, ticket: ms.length ? fat / ms.length : 0 };
  });

  const resumoCols = "grid-cols-[52px_1fr_1fr_1fr_48px]";

  return (
    <div className="flex flex-col gap-6">
      <Section title="Evolução mensal" Icon={TrendingUp}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <ChartCard title="Faturamento" height={150}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" {...axis} interval={1} />
              <YAxis {...axis} tickFormatter={moneyAxis} width={34} />
              <Tooltip content={<ChartTooltip money />} />
              <Bar dataKey="faturado" name="Faturado" fill={C.accent} radius={[4, 4, 0, 0]} fillOpacity={0.85} />
            </BarChart>
          </ChartCard>

          <ChartCard title="Notas emitidas" height={150}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" {...axis} interval={1} />
              <YAxis {...axis} allowDecimals={false} width={28} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="vendas"
                name="Notas"
                stroke={C.purple}
                strokeWidth={2.5}
                dot={{ r: 3, fill: C.purple }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartCard>

          <ChartCard title="Ticket médio" height={150}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gTicket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.amber} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={C.amber} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="name" {...axis} interval={1} />
              <YAxis {...axis} tickFormatter={moneyAxis} width={34} />
              <Tooltip content={<ChartTooltip money />} />
              <Area
                type="monotone"
                dataKey="ticket"
                name="Ticket médio"
                stroke={C.amber}
                strokeWidth={2}
                fill="url(#gTicket)"
              />
            </AreaChart>
          </ChartCard>
        </div>
      </Section>

      <Section title="Resumo por mês" Icon={CalendarDays}>
        <div className={`${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <div className={`grid ${resumoCols} gap-2 border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5`}>
                {["Mês", "Faturado", "Recebido", "Ticket médio", "Qtd"].map((h) => (
                  <span key={h} className={`${T.label} last:text-center`}>
                    {h}
                  </span>
                ))}
              </div>
              {monthly.map((m) => (
                <div
                  key={m.name}
                  className={`grid ${resumoCols} items-center gap-2 border-b border-white/[0.04] px-4 py-2 last:border-0 ${
                    m.vendas === 0 ? "opacity-40" : ""
                  }`}
                >
                  <span className={`${T.cell} text-[#8a85b4]`}>{m.name}</span>
                  <span className={`${T.cell} text-[#ece9ff]`}>{formatCurrency(m.faturado)}</span>
                  <span className={`${T.cell} text-[#5dcaa5]`}>{formatCurrency(m.recebido)}</span>
                  <span className={`${T.cell} text-[#fac775]`}>{formatCurrency(m.ticket)}</span>
                  <span className={`${T.cell} text-center text-[#8a85b4]`}>{m.vendas}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   6 · PÁGINA
═══════════════════════════════════════════════════════════════════ */

type NotaAberta = { id?: string; clienteId: string; nome?: string };

export default function CustomerDetailPage() {
  const { clienteId } = useParams<{ clienteId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<CustomerType | null>(null);
  const [pedidos, setPedidos] = useState<PedidoClienteType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [notaAberta, setNotaAberta] = useState<NotaAberta | null>(null);

  const load = useCallback(async () => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const [customerRes, pedidosRes] = await Promise.all([CustomerService.getById(clienteId), NoteService.getAll()]);
      const customerData = (customerRes.data as any)?.data ?? customerRes.data ?? null;
      setCustomer(customerData as CustomerType);

      // Blindagem contra itens nulos vindos da API
      const listaPedidos = (((pedidosRes.data as any)?.data ?? []) as any[]).filter(
        (v): v is PedidoClienteType => !!v && !!v.pedido,
      );
      setPedidos(listaPedidos);
    } catch {
      setCustomer(null);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    load();
  }, [load]);

  // Filtra os pedidos deste cliente pelo ID (não pelo nome)
  const customerPedidos = useMemo(() => pedidos.filter((v) => v.clienteId === clienteId), [pedidos, clienteId]);

  const totalFat = customerPedidos.filter((v) => !estaCancelado(v)).reduce((s, x) => s + totalDoPedido(x), 0);
  const cls = classify(customer ? totalFat : 0);
  const handleDeleted = useCallback(() => navigate("/clientes"), [navigate]);

  const abrirNota = (v: PedidoClienteType) =>
    setNotaAberta({
      id: v.pedido.pedidoId,
      clienteId: v.clienteId,
      nome: v.nomeCliente,
    });

  const fecharNota = () => {
    setNotaAberta(null);
    load(); // atualiza a lista/KPIs ao fechar a nota
  };

  if (loading)
    return (
      <div className="grid h-screen w-full place-items-center bg-[#0e0d1a]">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/[0.08] border-t-[#7c6ef5]" />
      </div>
    );

  if (!customer)
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[#0e0d1a]">
        <Users size={32} className="text-[#6b66a0]" />
        <p className="m-0 text-sm text-[#8a85b4]">Cliente não encontrado.</p>
        <button onClick={() => navigate("/clientes")} className="text-xs text-[#9b8ff5] underline">
          Voltar para Clientes
        </button>
      </div>
    );

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-[#0e0d1a] text-[#ece9ff] antialiased"
      style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" }}
    >
      <EditModal
        open={showEdit}
        customer={customer}
        onClose={() => setShowEdit(false)}
        onSaved={() => {
          setShowEdit(false);
          load();
        }}
      />
      <DeleteModal
        open={showDelete}
        customer={customer}
        onClose={() => setShowDelete(false)}
        onDeleted={handleDeleted}
      />

      {/* ── Cabeçalho ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-white/[0.08] bg-[#15132a]/95 backdrop-blur">
        <div className="w-full px-5 pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/clientes")}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#7c6ef5]/[0.12] text-[#9b8ff5] transition-colors hover:bg-[#7c6ef5]/[0.2]"
            >
              <ArrowLeft size={15} />
            </button>
            <img
              src={avatar(customer.nome)}
              alt={customer.nome}
              className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-white/[0.08]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`${T.h1} m-0 truncate`}>{customer.nome}</h1>
                {customer.status === eStatus.ATIVO ? (
                  <Badge tone="green" Icon={CheckCircle}>
                    Ativo
                  </Badge>
                ) : (
                  <Badge tone="muted" Icon={XCircle}>
                    Inativo
                  </Badge>
                )}
                <Badge tone={cls.tone} Icon={cls.Icon}>
                  {cls.label}
                </Badge>
              </div>
              <p className={`${T.meta} m-0 mt-0.5 truncate`}>
                {formatDoc(customer.cpfCnpj)} · {customerPedidos.length} nota
                {customerPedidos.length !== 1 ? "s" : ""}
                {customer.created_at ? ` · desde ${formatDate(customer.created_at)}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <button onClick={() => setShowEdit(true)} className={btn.accent}>
                <Pencil size={12} /> Editar
              </button>
              <button onClick={() => setShowDelete(true)} className={btn.danger}>
                <Trash2 size={12} /> Excluir
              </button>
            </div>
          </div>

          <nav className="mt-1 flex gap-1 overflow-x-auto">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === id
                    ? "border-[#7c6ef5] text-[#9b8ff5]"
                    : "border-transparent text-[#8a85b4] hover:text-[#cfcbee]"
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ── Conteúdo ──────────────────────────────────────────────── */}
      <main className="flex-1">
        <div className="w-full px-5 py-5">
          {activeTab === "overview" && <TabOverview pedidos={customerPedidos} />}
          {activeTab === "notas" && <TabNotas pedidos={customerPedidos} onAbrir={abrirNota} />}
          {activeTab === "historico" && <TabHistorico pedidos={customerPedidos} />}
        </div>
      </main>

      {/* ── Modal da nota (mesmo padrão do PDV) ───────────────────── */}
      <Modal
        open={!!notaAberta}
        onClose={fecharNota}
        title={notaAberta?.id ? "Venda" : "Nova venda"}
        subtitle={notaAberta?.nome}
        size="full"
      >
        {notaAberta && <Invoice id={notaAberta.id} clienteId={notaAberta.clienteId} nome={notaAberta.nome} />}
      </Modal>
    </div>
  );
}
