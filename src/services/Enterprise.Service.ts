import sysgrafix from "./sysgrafix.service";
import EnterpriseType from "../types/EnterpriseType";

const EnterpriseService = {
  getById: (id: number) => sysgrafix.get(`/empresas/cpf-cnpj/${id}`),
  update: (id: number, data: Partial<EnterpriseType>) => sysgrafix.put(`/enterprises/update/${id}`, data),
};

export default EnterpriseService;
