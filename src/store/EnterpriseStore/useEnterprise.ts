import { create } from "zustand";

import EnterpriseService from "../../services/Enterprise.Service";
import useEnterpriseProps from "./useEnterpriseProps";

const useEnterprise = create<useEnterpriseProps>((set) => ({
  enterprise: null,

  fetchEnterprise: async (id) => {
    await EnterpriseService.getById(id)
      .then((res) => set({ enterprise: res.data.data[0] }))
      .catch((err) => console.error("Erro ao buscar empresa:", err));
  },

  updateEnterprise: (id, data) => {
    return EnterpriseService.update(id, data)
      .then(() => {
        set((state) => ({
          enterprise: { ...state.enterprise!, ...data },
        }));
      })
      .catch((err) => console.error("Erro ao atualizar empresa:", err));
  },
}));

export default useEnterprise;
