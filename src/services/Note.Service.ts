import sysgrafix from "./sysgrafix.service";
import NoteType from "../types/InvoiceType";
import InvoiceType, { PedidoClienteType, PedidosResponseType } from "../types/InvoiceType";

const NoteService = {
  create: (note: NoteType | Record<string, unknown>) => sysgrafix.post("/pedidos/novo-pedido", note),
  getAll: () => sysgrafix.get<InvoiceType>("/pedidos/"),
  getById: async (pedidoId: string): Promise<PedidoClienteType | null> => {
    const { data } = await sysgrafix.get<PedidosResponseType>("/pedidos/");
    return data?.data?.find((registro) => registro.pedido.pedidoId === pedidoId) ?? null;
  },
  update: (note: Record<string, unknown>) => sysgrafix.put("/pedidos/update", note),
  delete: (pedidoId: string) => sysgrafix.delete(`/pedidos/${pedidoId}`),
};

export default NoteService;
