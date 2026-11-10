import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

import { authService } from "../services/auth";
import type { LoginDTO, UsuarioAuth } from "../types/auth";

interface AuthState {
  token: string | null;
  usuario: UsuarioAuth | null;

  cargando: boolean;
  verificandoSesion: boolean;
  sesionVerificada: boolean;
  error: string | null;

  iniciarSesion: (datos: LoginDTO) => Promise<void>;
  verificarSesion: () => Promise<void>;
  cerrarSesion: () => void;
  limpiarError: () => void;
}

let verificacionEnCurso: Promise<void> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      usuario: null,

      cargando: false,
      verificandoSesion: false,
      sesionVerificada: false,
      error: null,

      iniciarSesion: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const respuesta = await authService.login(datos);

          set({
            token: respuesta.access_token,
            usuario: respuesta.usuario,
            sesionVerificada: true,
          });
        } catch (error) {
          set({
            token: null,
            usuario: null,
            error: "No fue posible iniciar sesión.",
          });

          throw error;
        } finally {
          set({ cargando: false });
        }
      },

      verificarSesion: () => {
        if (verificacionEnCurso) {
          return verificacionEnCurso;
        }

        const token = get().token;

        if (!token) {
          set({
            usuario: null,
            sesionVerificada: true,
          });

          return Promise.resolve();
        }

        set({
          verificandoSesion: true,
          error: null,
        });

        verificacionEnCurso = (async () => {
          try {
            const usuario = await authService.obtenerPerfil();

            if (get().token !== token) return;

            set({
              usuario,
              sesionVerificada: true,
            });
          } catch (error) {
            if (get().token !== token) return;

            const status = axios.isAxiosError(error)
              ? error.response?.status
              : undefined;

            if (status === 401 || status === 403) {
              set({
                token: null,
                usuario: null,
                sesionVerificada: true,
              });
            } else {
              set({
                sesionVerificada: false,
                error: "No se pudo verificar la sesión.",
              });
            }
          } finally {
            set({ verificandoSesion: false });
          }
        })().finally(() => {
          verificacionEnCurso = null;
        });

        return verificacionEnCurso;
      },

      cerrarSesion: () => {
        set({
          token: null,
          usuario: null,
          error: null,
          sesionVerificada: true,
        });
      },

      limpiarError: () => set({ error: null }),
    }),
    {
      name: "pos-auth",
      partialize: (state) => ({
        token: state.token,
        usuario: state.usuario,
      }),
    },
  ),
);
