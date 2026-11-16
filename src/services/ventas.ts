import { api } from "../lib/axios";
import type { VentaCajero } from "../types/misVentas";

export const ventasService = {
  obtenerTodas: async (): Promise<VentaCajero[]> => {
    const { data } = await api.get<VentaCajero[]>("/ventas");

    return data;
  },
};
