import ClientType from "../types/ClientType";
import sysgrafix from "./sysgrafix.service";

const ClientService = {
  getAll: () => sysgrafix.get("/clientes"),
  getById: (id: string) => sysgrafix.get(`/clientes/id/${id}`),
  create: (params?: ClientType) => sysgrafix.post("/clientes/cadastrar", params),
  update: (id: string, params: Partial<ClientType>) => sysgrafix.put(`/clientes/${id}`, params),
  remove: (id: string) => sysgrafix.delete(`/clientes/${id}`),
};

export default ClientService;
