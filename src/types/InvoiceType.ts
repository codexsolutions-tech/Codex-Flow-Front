import PaymentType from "./PaymentType";

export type ProductPedidoType = {
  produtoId: string;
  quantidade: number;
  valorVenda: number;
};

type InvoiceType = {
  clienteId: string;
  codigoEmpresa?: string;
  produtosPedido: ProductPedidoType[];
};

export type InvoiceResponseType = InvoiceType & {
  id?: string;
  status?: string;
  payments?: PaymentType[];
  total_pago?: number;
  created_at?: string | Date;
};

export type ProdutoPedidoType = {
  produtoId: string;
  nomeProduto: string;
  valorProduto: number;
};

export type ItemPedidoType = {
  itemPedidoId: string;
  quantidadeItem: number;
  subtotalItens: number;
  valorVendaItem: number;
  produto: ProdutoPedidoType;
};

export type PedidoType = {
  pedidoId: string;
  dataPedido: string;
  pedidoStatus: "ABERTO" | "FECHADO" | "CANCELADO" | string;
  totalPedido: number;
  itensPedido: ItemPedidoType[];
};

export type PedidoClienteType = {
  clienteId: string;
  nomeCliente: string;
  statusCliente: string;
  pedido: PedidoType;
};

export type PedidosResponseType = {
  statusCode: number;
  message: string;
  data: PedidoClienteType[];
};

export default InvoiceType;
