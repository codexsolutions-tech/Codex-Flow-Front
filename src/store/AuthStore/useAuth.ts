import { create } from "zustand";

import AuthService from "../../services/auth.service";
import AuthFormInputs from "../../pages/Auth/Login/AuthSchema";
import useAuthProps from "./useAuthProps";
import { decodeToken, isTokenExpired } from "../../utils/decodeToken";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";

const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken?: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

const createUser = (token: string) => {
  const payload = decodeToken(token);

  return {
    id: payload.id,
    nome: payload.nome,
    email: payload.email,
    cargo: payload.cargo,
    permissao: payload.permissao,
    codigoEmpresa: payload.codigoEmpresa,
  };
};

const useAuth = create<useAuthProps & { loading: boolean }>((set, get) => {
  const authenticate = (accessToken: string, refreshToken?: string) => {
    storage.setTokens(accessToken, refreshToken);

    set({
      user: createUser(accessToken),
      isLogged: true,
      loading: false,
    });
  };

  const clearAuth = () => {
    storage.clear();

    set({
      user: null,
      isLogged: false,
      loading: false,
    });
  };

  return {
    user: null,
    isLogged: false,
    loading: true,

    login: async (data: AuthFormInputs) => {
      const response = await AuthService.login(data);

      const auth = response?.data?.data?.[0];

      if (!auth?.accessToken) {
        console.error("LOGIN: resposta inválida", response?.data);
        throw new Error("Resposta de login inválida");
      }

      authenticate(auth.accessToken, auth.refreshToken);
    },

    initialize: () => {
      if (!get().loading) return;

      const token = storage.getToken();

      if (!token) {
        set({ loading: false });
        return;
      }

      try {
        if (isTokenExpired(token)) {
          throw new Error("Token expirado");
        }

        set({
          user: createUser(token),
          isLogged: true,
          loading: false,
        });
      } catch {
        clearAuth();
      }
    },

    logout: () => {
      clearAuth();
    },
  };
});

export default useAuth;
