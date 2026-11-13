import { api } from "../lib/axios";
import type { MiPedidoWeb } from "../types/misPedidosWeb";

export const misPedidosWebService = {
  obtenerTodos: async (): Promise<MiPedidoWeb[]> => {
    const { data } = await api.get<MiPedidoWeb[]>("/ventas-web/mis-pedidos");

    return data;
  },

  obtenerPorId: async (id: number): Promise<MiPedidoWeb> => {
    const { data } = await api.get<MiPedidoWeb>(
      `/ventas-web/mis-pedidos/${id}`,
    );

    return data;
  },
};
