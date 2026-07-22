import sysgrafix from "./sysgrafix.service";
import NoteType, { PedidoClienteType } from "../types/InvoiceType";

const NoteService = {
  create: (note: NoteType | Record<string, unknown>) => sysgrafix.post("/pedidos/novo-pedido", note),

  getAll: () => sysgrafix.get("/pedidos/"),

  getById: async (pedidoId: string) => {
    
    const response = await sysgrafix.get<any>(`/pedidos/${pedidoId}`) 
    const pedido = response.data;
    return pedido.data;
  },

  update: async (note: Record<string, unknown>, pedidoId: string) => sysgrafix.patch(`/pedidos/alterar/${pedidoId}`, note),

  delete: (pedidoId: string) => sysgrafix.delete(`/pedidos/${pedidoId}`),
};

export default NoteService;
