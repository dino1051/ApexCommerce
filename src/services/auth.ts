import { api } from "../lib/axios";
import type { UsuarioAuth } from "../types/auth";

import type { LoginDTO, LoginResponse } from "../types/auth";

export const authService = {
  login: async (datos: LoginDTO): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", datos);

    return data;
  },
  obtenerPerfil: async (): Promise<UsuarioAuth> => {
    const { data } = await api.get<UsuarioAuth>("/auth/me");

    return data;
  },
};
