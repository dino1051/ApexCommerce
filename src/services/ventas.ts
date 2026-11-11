import { api } from "../lib/axios";
import type { Venta } from "../types/venta";

export const ventasService = {
  obtenerTodas: async (): Promise<Venta[]> => {
    const { data } = await api.get<Venta[]>("/ventas");
    return data;
  },
};
