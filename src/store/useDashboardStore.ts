import { create } from "zustand";

import { dashboardService } from "../services/dashboard";

import type {
  ResumenDiario,
  SesionCajaAbierta,
  ResumenPedidos,
} from "../types/dashboard";

interface DashboardState {
  resumen: ResumenDiario | null;
  sesionesAbiertas: SesionCajaAbierta[];
  resumenPedidos: ResumenPedidos | null;
  cargando: boolean;
  error: string | null;

  cargarDashboard: () => Promise<void>;
  limpiarDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  resumen: null,
  sesionesAbiertas: [],
  resumenPedidos: null,
  cargando: false,
  error: null,

  cargarDashboard: async () => {
    set({
      cargando: true,
      error: null,
    });

    try {
      const [resumen, sesionesAbiertas, resumenPedidos] = await Promise.all([
        dashboardService.obtenerResumenDiario(),
        dashboardService.obtenerSesionesAbiertas(),
        dashboardService.obtenerResumenPedidos(),
      ]);

      set({
        resumen,
        sesionesAbiertas,
        resumenPedidos,
      });
    } catch (error) {
      console.error("Error al cargar el Dashboard:", error);

      set({
        error: "No fue posible cargar el Dashboard.",
      });
    } finally {
      set({
        cargando: false,
      });
    }
  },

  limpiarDashboard: () =>
    set({
      resumen: null,
      resumenPedidos: null,
      sesionesAbiertas: [],
      cargando: false,
      error: null,
    }),
}));
