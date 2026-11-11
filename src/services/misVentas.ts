import { api } from "../lib/axios";
import type { VentaCajero } from "../types/misVentas";

export const misVentasService = {
  obtenerTodas: async (): Promise<VentaCajero[]> => {
    const { data } = await api.get<VentaCajero[]>("/ventas/misventas");

    return data;
  },
};
