import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Receipt,
  BarChart3,
  UserCheck,
  DollarSign,
  Wallet,
  AlertCircle,
  Hash,
  TrendingUp,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { PageHeader, Button, Badge, KpiCard, SectionCard, SearchInput, EmptyState, Avatar } from "../components/ui";
import Invoice from "../components/Invoice/Invoice";
import { Modal } from "../components/Modals/Modal";

import NoteService from "../services/Note.Service";
import ClientService from "../services/Client.Service";
import { formatCurrency } from "../utils/formatCurrency";

import { PedidoClienteType } from "../types/InvoiceType";
import ClientType from "../types/ClientType";

const ehHoje = (data?: string | Date) => {
  if (!data) return false;
  const d = new Date(data);
  const agora = new Date();
  return (
    d.getDate() === agora.getDate() && d.getMonth() === agora.getMonth() && d.getFullYear() === agora.getFullYear()
  );
};

const horaVenda = (data?: string | Date) =>
  data ? new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--";

// totalPedido vem pronto da API; se vier zerado, recalcula pelos itens
const totalDoPedido = (v: PedidoClienteType) =>
  Number(v.pedido.totalPedido) ||
  (v.pedido.itensPedido ?? []).reduce(
    (acc, item) => acc + Number(item.valorVendaItem || 0) * Number(item.quantidadeItem || 0),
    0,
  );

const estaAberta = (v: PedidoClienteType) => v.pedido.pedidoStatus === "ABERTO";

// Só o essencial: quem é o cliente e (se existir) qual pedido.
type NotaAberta = { id?: string; clienteId: string; nome?: string };

const PontoDeVenda = () => {
  const [vendas, setVendas] = useState<PedidoClienteType[]>([]);
  const [clientes, setClientes] = useState<ClientType[]>([]);

  const [novaVendaOpen, setNovaVendaOpen] = useState(false);
  const [relatorioOpen, setRelatorioOpen] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [busca, setBusca] = useState("");
  const [somenteHoje, setSomenteHoje] = useState(true);
  const [notaAberta, setNotaAberta] = useState<NotaAberta | null>(null);

  const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  const carregarVendas = () => {
    NoteService.getAll()
      .then(({ data }) => {
        // Filtra itens nulos/incompletos que a API às vezes devolve
        const lista = (data.data ?? []).filter((v): v is PedidoClienteType => !!v && !!v.pedido);
        setVendas(lista);
      })
      .catch(() => setVendas([]));
  };

  useEffect(() => {
    carregarVendas();

    ClientService.getAll()
      .then(({ data }) => setClientes(data.data ?? []))
      .catch(() => setClientes([]));
  }, []);

  // Mais recentes primeiro; filtro "hoje" opcional
  const vendasVisiveis = useMemo(() => {
    const base = somenteHoje ? vendas.filter((v) => ehHoje(v.pedido.dataPedido)) : vendas;
    return [...base].sort((a, b) => +new Date(b.pedido.dataPedido) - +new Date(a.pedido.dataPedido));
  }, [vendas, somenteHoje]);

  const vendasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return vendasVisiveis;
    return vendasVisiveis.filter((v) => v.nomeCliente?.toLowerCase().includes(termo));
  }, [vendasVisiveis, busca]);

  // KPIs sempre sobre o recorte visível (hoje ou todas)
  const faturamento = vendasVisiveis.reduce((acc, v) => acc + totalDoPedido(v), 0);
  const recebido = vendasVisiveis.filter((v) => !estaAberta(v)).reduce((acc, v) => acc + totalDoPedido(v), 0);
  const pendente = Math.max(faturamento - recebido, 0);
  const ticketMedio = vendasVisiveis.length ? faturamento / vendasVisiveis.length : 0;

  // ----- Autocomplete de clientes -----
  const sugestoes = useMemo(() => {
    const termo = nomeCliente.trim().toLowerCase();
    if (!termo) return [];
    return clientes.filter((c) => c.nome?.toLowerCase().includes(termo)).slice(0, 5);
  }, [clientes, nomeCliente]);

  const clienteSelecionavel = useMemo(() => {
    const termo = nomeCliente.trim().toLowerCase();
    return clientes.find((c) => c.nome?.toLowerCase() === termo);
  }, [clientes, nomeCliente]);

  // ----- Ações -----
  const abrirNota = (nota: NotaAberta) => {
    setNotaAberta(nota);
    setNovaVendaOpen(false);
    setNomeCliente("");
  };

  const fecharNota = () => {
    setNotaAberta(null);
    carregarVendas(); // atualiza KPIs e lista ao fechar a nota
  };

  return (
    <div className="flex h-full w-full flex-col gap-5 overflow-y-auto bg-canvas p-4 text-ink sm:p-5">
      {/* Header */}
      <PageHeader icon={<ShoppingCart size={18} />} title="Ponto de Venda" subtitle="Inicie vendas e acompanhe o dia">
        <Badge tone="neutral" icon={<CalendarDays size={13} className="text-accent-soft" />}>
          <span className="capitalize">{hoje}</span>
        </Badge>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          icon={<DollarSign size={16} />}
          label="Faturamento"
          value={formatCurrency(faturamento)}
          tone="accent"
        />
        <KpiCard icon={<Wallet size={16} />} label="Recebido" value={formatCurrency(recebido)} tone="success" />
        <KpiCard icon={<AlertCircle size={16} />} label="Pendente" value={formatCurrency(pendente)} tone="warning" />
        <KpiCard icon={<Hash size={16} />} label="Vendas" value={String(vendasVisiveis.length)} tone="neutral" />
      </div>

      {/* Ações */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Button icon={<Plus size={16} />} onClick={() => setNovaVendaOpen(true)}>
          Nova venda
        </Button>
        <SearchInput value={busca} onChange={setBusca} placeholder="Buscar venda por cliente…" className="flex-1" />

        {/* Hoje / Todas */}
        <div className="flex overflow-hidden rounded-lg border border-white/[0.08] text-xs">
          <button
            onClick={() => setSomenteHoje(true)}
            className={`px-3 py-2 transition-colors ${somenteHoje ? "bg-white/[0.1] text-ink" : "text-mist hover:bg-white/[0.05]"}`}
          >
            Hoje
          </button>
          <button
            onClick={() => setSomenteHoje(false)}
            className={`px-3 py-2 transition-colors ${!somenteHoje ? "bg-white/[0.1] text-ink" : "text-mist hover:bg-white/[0.05]"}`}
          >
            Todas
          </button>
        </div>
      </div>

      {/* Lista de vendas */}
      <SectionCard
        title={somenteHoje ? "Vendas de hoje" : "Todas as vendas"}
        actions={
          <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-mist">
            {vendasVisiveis.length} {vendasVisiveis.length === 1 ? "venda" : "vendas"}
          </span>
        }
        className="min-h-[320px] flex-1"
        bodyClassName="flex-1 p-3"
      >
        {vendasFiltradas.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {vendasFiltradas.map((venda) => {
              const total = totalDoPedido(venda);
              const aberta = estaAberta(venda);

              return (
                <button
                  key={venda.pedido.pedidoId}
                  onClick={() =>
                    abrirNota({
                      id: venda.pedido.pedidoId,
                      clienteId: venda.clienteId,
                      nome: venda.nomeCliente,
                    })
                  }
                  className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-left transition-colors hover:bg-white/[0.06] sm:px-3.5"
                >
                  <Avatar name={venda.nomeCliente} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{venda.nomeCliente}</p>
                    <p className="text-xs text-mist">
                      {horaVenda(venda.pedido.dataPedido)}
                      {!somenteHoje && ` · ${new Date(venda.pedido.dataPedido).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>

                  {/* Badge some no celular pra não espremer o valor */}
                  <span className="hidden sm:block">
                    <Badge tone={aberta ? "warning" : "success"}>{aberta ? "Aberta" : "Paga"}</Badge>
                  </span>

                  <div className="text-right">
                    <p className="nums text-sm font-medium">{formatCurrency(total)}</p>
                    <p className={`nums text-xs ${aberta ? "text-warning" : "text-success"}`}>
                      {aberta ? "aberta" : "paga"}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-faint" />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Receipt size={24} />}
            title={busca.trim() ? "Nenhuma venda encontrada" : somenteHoje ? "Nenhuma venda hoje" : "Nenhuma venda"}
            description={busca.trim() ? "Tente buscar por outro cliente." : "Clique em “Nova venda” para começar."}
          />
        )}
      </SectionCard>

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] pt-4">
        <p className="flex items-center gap-2 text-sm text-mist">
          <TrendingUp size={15} className="text-accent-soft" />
          Ticket médio: <span className="nums font-medium text-ink">{formatCurrency(ticketMedio)}</span>
        </p>
        <Button variant="ghost" size="sm" icon={<BarChart3 size={14} />} onClick={() => setRelatorioOpen(true)}>
          Relatório do dia
        </Button>
      </div>

      {/* Modal — nova venda (pequeno) */}
      <Modal
        open={novaVendaOpen}
        onClose={() => setNovaVendaOpen(false)}
        title="Iniciar venda"
        subtitle="Informe o cliente para abrir a nota"
        size="md"
      >
        <div className="flex flex-col gap-3">
          <SearchInput value={nomeCliente} onChange={setNomeCliente} placeholder="Digite o nome do cliente…" />

          {nomeCliente.trim() && !clienteSelecionavel && (
            <Badge tone="warning" icon={<UserCheck size={12} />}>
              Cliente novo — cadastre-o antes de iniciar a venda
            </Badge>
          )}

          {sugestoes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {sugestoes.map((c, i) => (
                <button
                  key={c.id ?? i}
                  onClick={() => c.id && abrirNota({ clienteId: String(c.id), nome: c.nome })}
                  className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-left text-sm transition-colors hover:bg-white/[0.06]"
                >
                  <Avatar name={c.nome} size="sm" />
                  <span className="flex-1 truncate">{c.nome}</span>
                  <span className="text-xs text-success">existente</span>
                </button>
              ))}
            </div>
          )}

          <Button
            icon={<Plus size={16} />}
            disabled={!clienteSelecionavel}
            onClick={() =>
              clienteSelecionavel?.id &&
              abrirNota({ clienteId: String(clienteSelecionavel.id), nome: clienteSelecionavel.nome })
            }
          >
            Iniciar venda
          </Button>
        </div>
      </Modal>

      {/* Modal — nota do PDV: tela cheia no celular, quase toda a viewport no desktop */}
      <Modal
        open={!!notaAberta}
        onClose={fecharNota}
        title={notaAberta?.id ? "Venda" : "Nova venda"}
        subtitle={notaAberta?.nome}
        size="full"
      >
        {notaAberta && <Invoice id={notaAberta.id} clienteId={notaAberta.clienteId} nome={notaAberta.nome} />}
      </Modal>

      {/* Modal — relatório do dia (médio) */}
      <Modal
        open={relatorioOpen}
        onClose={() => setRelatorioOpen(false)}
        title={somenteHoje ? "Relatório do dia" : "Relatório geral"}
        subtitle={somenteHoje ? "Resumo das vendas de hoje" : "Resumo de todas as vendas"}
        size="lg"
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              icon={<DollarSign size={16} />}
              label="Faturamento"
              value={formatCurrency(faturamento)}
              tone="accent"
            />
            <KpiCard icon={<Wallet size={16} />} label="Recebido" value={formatCurrency(recebido)} tone="success" />
            <KpiCard
              icon={<AlertCircle size={16} />}
              label="Pendente"
              value={formatCurrency(pendente)}
              tone="warning"
            />
            <KpiCard icon={<Hash size={16} />} label="Vendas" value={String(vendasVisiveis.length)} tone="neutral" />
          </div>

          <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mist">Ticket médio</span>
              <span className="nums font-medium">{formatCurrency(ticketMedio)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist">Vendas pagas</span>
              <span className="nums">{vendasVisiveis.filter((v) => !estaAberta(v)).length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist">Vendas abertas</span>
              <span className="nums">{vendasVisiveis.filter((v) => estaAberta(v)).length}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PontoDeVenda;
