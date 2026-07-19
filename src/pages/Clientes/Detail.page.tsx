import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Pencil,
  FileText,
  MessageCircle,
  Mail,
  CalendarDays,
  Loader2,
  AlertTriangle,
  PhoneCall,
  Receipt,
  Wallet,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";

import CustomerService from "../../services/client.service";
import NoteService from "../../services/note.service";
import CustomerType, { eStatus } from "../../types/ClientType";
import { PedidoClienteType } from "../../types/InvoiceType";
import { useAlert } from "../../components/Alert/Alert";
import { formatDate, getInitials, onlyDigits, formatDocument, formatNumber } from "../../utils/format";
import { formatCurrency } from "../../utils/formatCurrency";

import ClienteEditForm from "./Components/Form/cliente-edit.form";
import { ClienteFormData } from "./Components/Schema/cliente.schema";
import ClienteSalesChart from "./Components/Chart/ClientesSalesChart";

const StatusBadge = ({ status }: { status: eStatus }) =>
  status === eStatus.ATIVO ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0f6e56]/40 bg-[#0f6e56]/20 px-2.5 py-1 text-[11px] font-medium text-[#5dcaa5]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#5dcaa5]" /> Ativo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#8a85b4]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#6f6a93]" /> Inativo
    </span>
  );

const PEDIDO_STATUS: Record<string, { label: string; cls: string }> = {
  ABERTO: { label: "Aberto", cls: "border-[#8a6d1f]/50 bg-[#8a6d1f]/20 text-[#e0b955]" },
  FECHADO: { label: "Fechado", cls: "border-[#0f6e56]/40 bg-[#0f6e56]/20 text-[#5dcaa5]" },
  CANCELADO: { label: "Cancelado", cls: "border-[#a22d2d]/40 bg-[#a22d2d]/20 text-[#f09595]" },
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-2xl border border-white/[0.07] bg-[#15132a] p-4">
    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c6ef5]/[0.15] text-[#9b8ff5]">
      {icon}
    </div>
    <p className="text-[11px] uppercase tracking-wide text-[#6b6790]">{label}</p>
    <p className="mt-0.5 truncate text-lg font-semibold tracking-tight text-[#f1eeff] tabular-nums">{value}</p>
  </div>
);

const ClienteDetalhe = () => {
  const params = useParams();
  const id = params.id ?? params.clienteId ?? Object.values(params)[0];
  const navigate = useNavigate();
  const alert = useAlert();

  const [client, setClient] = useState<CustomerType | null>(null);
  const [pedidos, setPedidos] = useState<PedidoClienteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        setError("Cliente não informado.");
        return;
      }
      const res = await CustomerService.getAll();
      const list = (Array.isArray(res.data) ? res.data : (res.data?.data ?? [])) as CustomerType[];
      const found = list.find((c) => String(c.id) === String(id)) ?? null;

      if (!found) {
        setError("Cliente não encontrado.");
        return;
      }

      setClient(found);

      try {
        const pres = await NoteService.getAll();
        const all = pres.data?.data ?? [];
        setPedidos(all.filter((p) => String(p.clienteId) === String(found.id)));
      } catch {
        setPedidos([]);
      }
    } catch {
      setError("Não foi possível carregar o cliente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpdate = async (data: ClienteFormData) => {
    if (!client?.id) return;
    setSaving(true);
    try {
      await CustomerService.update(client.id, data);
      setShowEdit(false);
      await load();
      alert.success("Cliente atualizado", "As alterações foram salvas com sucesso.");
    } catch {
      alert.error("Erro ao salvar", "Não foi possível atualizar o cliente.");
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    const total = pedidos.reduce((a, p) => a + (p.pedido?.totalPedido ?? 0), 0);
    const count = pedidos.length;
    const ticket = count ? total / count : 0;
    const ultimo = pedidos.reduce<Date | null>((acc, p) => {
      const d = p.pedido?.dataPedido ? new Date(p.pedido.dataPedido) : null;
      if (!d) return acc;
      return !acc || d > acc ? d : acc;
    }, null);
    return { total, count, ticket, ultimo };
  }, [pedidos]);

  const monthly = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return {
        key: `${d.getFullYear()}-${d.getMonth()}`,
        label: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
        total: 0,
      };
    });
    const idx = new Map(buckets.map((b, i) => [b.key, i]));
    pedidos.forEach((p) => {
      if (!p.pedido?.dataPedido) return;
      const d = new Date(p.pedido.dataPedido);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      const i = idx.get(k);
      if (i !== undefined) buckets[i].total += p.pedido.totalPedido ?? 0;
    });
    return buckets;
  }, [pedidos]);

  const statusBreak = useMemo(() => {
    const c: Record<string, number> = { FECHADO: 0, ABERTO: 0, CANCELADO: 0 };
    pedidos.forEach((p) => {
      const s = p.pedido?.pedidoStatus ?? "";
      if (s in c) c[s] += 1;
    });
    const total = pedidos.length || 1;
    return [
      { key: "FECHADO", label: "Fechados", color: "#5dcaa5", count: c.FECHADO, pct: (c.FECHADO / total) * 100 },
      { key: "ABERTO", label: "Abertos", color: "#e0b955", count: c.ABERTO, pct: (c.ABERTO / total) * 100 },
      { key: "CANCELADO", label: "Cancelados", color: "#f09595", count: c.CANCELADO, pct: (c.CANCELADO / total) * 100 },
    ];
  }, [pedidos]);

  const pedidosOrdenados = useMemo(
    () =>
      [...pedidos].sort((a, b) => {
        const da = a.pedido?.dataPedido ? new Date(a.pedido.dataPedido).getTime() : 0;
        const db = b.pedido?.dataPedido ? new Date(b.pedido.dataPedido).getTime() : 0;
        return db - da;
      }),
    [pedidos],
  );

  const totalPages = Math.ceil(pedidosOrdenados.length / ITEMS_PER_PAGE);
  const currentPedidos = pedidosOrdenados.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const waDigits = onlyDigits(client?.contato?.whatsapp ?? "");
  const telDigits = onlyDigits(client?.contato?.telefone ?? client?.contato?.celular ?? "");
  const email = client?.contato?.email;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#0e0d1a] text-[#e8e4ff]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(124,110,245,0.16),transparent_70%)]" />

      <header className="relative z-20 shrink-0 border-b border-white/[0.07] bg-[#0e0d1a]/80 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => navigate("/clientes")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#b7b2d8] hover:bg-white/[0.08]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#7c6ef5]/25 bg-gradient-to-br from-[#7c6ef5]/25 to-[#a78bfa]/10 text-[13px] font-semibold text-[#b7aef9]">
              {client ? getInitials(client.nome) : "…"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-lg font-semibold tracking-tight text-[#f1eeff]">
                  {client?.nome ?? "Cliente"}
                </h1>
              </div>
              <p className="truncate text-xs text-[#6f6a93]">
                {client?.cpfCnpj ? formatDocument(client.cpfCnpj) : "—"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative flex-1 overflow-hidden px-2 py-4 lg:px-4 lg:py-3">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[#6f6a93]" />
          </div>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-8 w-8 text-[#f09595]" />
            <p className="text-[#f0a5a5]">{error}</p>
            <button onClick={load} className="mt-4 rounded-lg bg-white/[0.08] px-4 py-2 text-sm hover:bg-white/[0.15]">
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="grid h-full grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="flex flex-col gap-4 xl:col-span-2">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <StatCard icon={<Wallet size={16} />} label="Total em pedidos" value={formatCurrency(stats.total)} />
                <StatCard icon={<ShoppingBag size={16} />} label="Pedidos" value={formatNumber(stats.count)} />
                <StatCard icon={<TrendingUp size={16} />} label="Ticket médio" value={formatCurrency(stats.ticket)} />
                <StatCard
                  icon={<CalendarDays size={16} />}
                  label="Último pedido"
                  value={stats.ultimo ? formatDate(stats.ultimo) : "—"}
                />
              </div>

              {/* Vendas Chart */}
              <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#15132a]">
                <div className="border-b border-white/[0.07] bg-white/[0.02] px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#7c6ef5]/[0.15] p-2">
                      <TrendingUp className="h-4 w-4 text-[#9b8ff5]" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-medium text-[#e8e4ff]">Vendas (6 meses)</h2>
                      <p className="text-[11px] text-[#6f6a93]">Total por mês</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-4 min-h-[280px]">
                  <ClienteSalesChart monthlyData={monthly} />
                </div>
              </div>

              {/* Pedidos */}
              <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-[#15132a] flex-1">
                <div className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#7c6ef5]/[0.15] p-2">
                      <Receipt className="h-4 w-4 text-[#9b8ff5]" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-medium">Pedidos</h2>
                      <p className="text-[11px] text-[#6f6a93]">{pedidos.length} pedidos</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  {pedidosOrdenados.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-[#6f6a93]">
                      Nenhum pedido encontrado
                    </div>
                  ) : (
                    currentPedidos.map((p) => {
                      const st = PEDIDO_STATUS[p.pedido?.pedidoStatus] ?? { label: "—", cls: "" };
                      const nItens = p.pedido?.itensPedido?.length ?? 0;
                      return (
                        <div
                          key={p.pedido?.pedidoId}
                          className="border-b border-white/[0.04] px-5 py-3.5 flex items-center justify-between last:border-b-0"
                        >
                          <div className="flex items-center gap-3">
                            <Receipt className="text-[#9b8ff5]" size={18} />
                            <div>
                              <p className="text-[#e8e4ff]">#{p.pedido?.pedidoId?.slice(0, 8)}</p>
                              <p className="text-xs text-[#6f6a93]">
                                {formatDate(p.pedido?.dataPedido)} • {nItens} itens
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                            <p className="font-medium mt-1">{formatCurrency(p.pedido?.totalPedido ?? 0)}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="border-t border-white/[0.06] p-4 flex justify-between text-sm">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="text-[#9b8ff5] disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <span className="text-[#6f6a93]">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="text-[#9b8ff5] disabled:opacity-40"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ASIDE - VERSÃO FINAL AJUSTADA */}
            <aside className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#1a1633] to-[#15132a] p-4">
                <div className="pointer-events-none absolute -top-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded bg-[#7c6ef5]/15 blur-[80px]" />

                {client && (
                  <button
                    onClick={() => setShowEdit(true)}
                    className="absolute top-5 right-5 flex items-center gap-2 rounded-2xl border border-[#7c6ef5]/30 bg-[#7c6ef5]/[0.12] p-3 text-sm text-[#c4baff] hover:bg-[#7c6ef5]/20 hover:border-[#7c6ef5]/50 transition-all active:scale-95 z-10"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                )}

                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl border border-[#7c6ef5]/40 bg-[#0e0d1a] text-4xl text-[#d4c8ff]">
                        {client ? getInitials(client.nome) : "?"}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#f1eeff]">{client?.nome}</h2>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-[#a39ec7]">
                      <FileText size={16} className="text-[#7c6ef5]" />
                      {client?.cpfCnpj ? formatDocument(client.cpfCnpj) : "—"}
                    </p>

                    {/* Status */}
                    <div className="mt-3 mb-4">{client && <StatusBadge status={client.status} />}</div>

                    {/* Contatos */}
                    <div className="space-y-2.5 text-[13px]">
                      {client?.contato?.email && (
                        <div className="flex items-center gap-3 text-[#c8c2e6]">
                          <Mail size={17} className="text-[#7c6ef5]" />
                          <span className="truncate">{client.contato.email}</span>
                        </div>
                      )}
                      {(client?.contato?.celular || client?.contato?.telefone) && (
                        <div className="flex items-center gap-3 text-[#c8c2e6]">
                          <PhoneCall size={17} className="text-[#7c6ef5]" />
                          <span>{formatNumber(client.contato.celular || client.contato.telefone || "")}</span>
                        </div>
                      )}
                      {client?.contato?.whatsapp && (
                        <div className="flex items-center gap-3 text-[#c8c2e6]">
                          <MessageCircle size={17} className="text-[#5dcaa5]" />
                          <span>{formatNumber(client.contato.whatsapp)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status dos pedidos */}
              {pedidos.length > 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#15132a] p-5">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#8a86b0]">
                    Status dos pedidos
                  </p>
                  <div className="space-y-3">
                    {statusBreak.map((s) => (
                      <div key={s.key}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="flex items-center gap-2 text-[#8a85b4]">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                            {s.label}
                          </span>
                          <span className="font-medium text-[#e8e4ff]">{s.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${s.pct}%`, backgroundColor: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ações rápidas */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#15132a] p-5">
                <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.12em] text-[#8a86b0]">Ações rápidas</p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={waDigits ? `https://wa.me/55${waDigits}` : undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0f6e56]/20 text-[#5dcaa5]">
                      <MessageCircle size={18} />
                    </span>
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={telDigits ? `tel:${telDigits}` : undefined}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7c6ef5]/[0.15] text-[#9b8ff5]">
                      <PhoneCall size={18} />
                    </span>
                    <span>Ligar</span>
                  </a>

                  <a
                    href={email ? `mailto:${email}` : undefined}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] px-4 py-3 hover:bg-white/[0.04] transition-colors"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4aa8ff]/15 text-[#a9d6ff]">
                      <Mail size={18} />
                    </span>
                    <span>E-mail</span>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      {client && (
        <ClienteEditForm
          open={showEdit}
          client={client}
          saving={saving}
          onClose={() => setShowEdit(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default ClienteDetalhe;
