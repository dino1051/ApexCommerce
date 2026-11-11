import { api } from "../lib/axios";

import type { ArticuloPos, CrearVentaDTO, VentaCreada } from "../types/pos";

export const posService = {
  obtenerArticulos: async (): Promise<ArticuloPos[]> => {
    const { data } = await api.get<ArticuloPos[]>("/articulos");

    return data;
  },

  crearVenta: async (venta: CrearVentaDTO): Promise<VentaCreada> => {
    const { data } = await api.post<VentaCreada>("/ventas", venta);

    return data;
  },
};
