import { api } from "../lib/axios";
import type { ProductoTienda } from "../types/tienda";

export const tiendaService = {
  obtenerProductos: async (): Promise<ProductoTienda[]> => {
    const { data } = await api.get<ProductoTienda[]>("/articulos");

    return data;
  },

  obtenerProductoPorId: async (id: number): Promise<ProductoTienda> => {
    const { data } = await api.get<ProductoTienda>(`/articulos/${id}`);

    return data;
  },
};
