import { api } from "../lib/axios";

import type {
  ResumenDiario,
  SesionCajaAbierta,
  ResumenPedidos,
} from "../types/dashboard";

export const dashboardService = {
  obtenerResumenDiario: async (): Promise<ResumenDiario> => {
    const { data } = await api.get<ResumenDiario>("/ventas/resumen-diario");

    return data;
  },

  obtenerSesionesAbiertas: async (): Promise<SesionCajaAbierta[]> => {
    const { data } = await api.get<SesionCajaAbierta[]>(
      "/sesiones-caja/abiertas",
    );

    return data;
  },

  obtenerResumenPedidos: async (): Promise<ResumenPedidos> => {
    const { data } = await api.get<ResumenPedidos>("/ventas-web/resumen");

    return data;
  },
};
