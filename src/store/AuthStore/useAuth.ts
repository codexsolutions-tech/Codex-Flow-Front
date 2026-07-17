import { create } from "zustand";

import AuthService from "../../services/auth.service";
import AuthFormInputs from "../../pages/Auth/Login/AuthSchema";
import useAuthProps from "./useAuthProps";
import { decodeToken, isTokenExpired } from "../../utils/decodeToken";

const useAuth = create<useAuthProps & { loading: boolean }>((set, get) => ({
  user: null,
  isLogged: false,
  loading: true,

  login: async (data: AuthFormInputs) => {
    const response = await AuthService.login(data);

    const payloadData = response?.data?.data?.[0];
    const accessToken = payloadData?.accessToken;
    const refreshToken = payloadData?.refreshToken;

    if (!accessToken) {
      console.error("LOGIN: resposta sem accessToken →", response?.data);
      throw new Error("Resposta de login inválida");
    }

    localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

    const payload = decodeToken(accessToken);

    set({
      user: {
        id: payload.id,
        nome: payload.nome,
        email: payload.email,
        cargo: payload.cargo,
        permissao: payload.permissao,
        codigoEmpresa: payload.codigoEmpresa,
      },
      isLogged: true,
      loading: false,
    });
  },

  initialize: () => {
    if (!get().loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      if (isTokenExpired(token)) {
        throw new Error("Token expirado");
      }

      const payload = decodeToken(token);

      set({
        user: {
          id: payload.id,
          nome: payload.nome,
          email: payload.email,
          cargo: payload.cargo,
          permissao: payload.permissao,
          codigoEmpresa: payload.codigoEmpresa,
        },
        isLogged: true,
        loading: false,
      });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      set({ user: null, isLogged: false, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({ user: null, isLogged: false });
  },
}));

export default useAuth;
