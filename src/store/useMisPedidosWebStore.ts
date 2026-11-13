import { create } from "zustand";
import { AxiosError } from "axios";

import { misPedidosWebService } from "../services/misPedidosWeb";
import type { MiPedidoWeb } from "../types/misPedidosWeb";

interface MisPedidosWebState {
  pedidos: MiPedidoWeb[];
  cargando: boolean;
  error: string | null;

  cargarPedidos: () => Promise<void>;
  limpiarPedidos: () => void;
}

export const useMisPedidosWebStore = create<MisPedidosWebState>()((set) => ({
  pedidos: [],
  cargando: false,
  error: null,

  cargarPedidos: async () => {
    set({
      cargando: true,
      error: null,
    });

    try {
      const pedidos = await misPedidosWebService.obtenerTodos();

      set({ pedidos });
    } catch (error) {
      let mensaje = "No fue posible cargar tus pedidos.";

      if (error instanceof AxiosError) {
        const respuesta = error.response?.data?.message;

        if (typeof respuesta === "string") {
          mensaje = respuesta;
        }
      }

      set({
        pedidos: [],
        error: mensaje,
      });
    } finally {
      set({ cargando: false });
    }
  },

  limpiarPedidos: () =>
    set({
      pedidos: [],
      cargando: false,
      error: null,
    }),
}));
