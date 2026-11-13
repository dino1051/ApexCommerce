import { api } from "../lib/axios";

import type {
  VentaWeb,
  VentaWebDetalle,
  EstadoPedidoWeb,
} from "../types/ventasWeb";

export const ventasWebService = {
  obtenerTodas: async (): Promise<VentaWeb[]> => {
    const { data } = await api.get<VentaWeb[]>("/ventas-web");

    return data;
  },

  obtenerPorId: async (id: number): Promise<VentaWebDetalle> => {
    const { data } = await api.get<VentaWebDetalle>(`/ventas-web/${id}`);

    return data;
  },

  actualizarEstado: async (
    id: number,
    estado: EstadoPedidoWeb,
  ): Promise<void> => {
    await api.patch(`/ventas-web/${id}/estado`, {
      estado,
    });
  },
};
