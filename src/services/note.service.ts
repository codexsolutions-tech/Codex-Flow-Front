import sysgrafix from "./sysgrafix.service";
import NoteType, { PedidoClienteType } from "../types/InvoiceType";

const NoteService = {
  create: (note: NoteType | Record<string, unknown>) => sysgrafix.post("/pedidos/novo-pedido", note),

  getAll: () => sysgrafix.get("/pedidos/"),

  getById: (pedidoId: string): Promise<PedidoClienteType | undefined> => sysgrafix.get<{ data: PedidoClienteType[] }>(`/pedidos/${pedidoId}`).then(({ data }) => data.data[0]),

  update: async (note: Record<string, unknown>, pedidoId: string) => sysgrafix.patch(`/pedidos/alterar/${pedidoId}`, note),

  delete: (pedidoId: string) => sysgrafix.delete(`/pedidos/${pedidoId}`),
};

export default NoteService;
