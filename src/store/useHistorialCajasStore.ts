import { create } from "zustand";
import { AxiosError } from "axios";

import { cajasService } from "../services/cajas";
import type { SesionCajaHistorial } from "../types/cajas";

interface HistorialCajasState {
  sesiones: SesionCajaHistorial[];
  cargando: boolean;
  error: string | null;

  cargarHistorial: () => Promise<void>;
  limpiarHistorial: () => void;
}

export const useHistorialCajasStore = create<HistorialCajasState>()((set) => ({
  sesiones: [],
  cargando: false,
  error: null,

  cargarHistorial: async () => {
    set({ cargando: true, error: null });

    try {
      const sesiones = await cajasService.obtenerHistorial();

      set({ sesiones });
    } catch (error) {
      let mensaje = "No fue posible cargar el historial de cajas.";

      if (error instanceof AxiosError) {
        const respuesta = error.response?.data?.message;

        if (typeof respuesta === "string") {
          mensaje = respuesta;
        }
      }

      set({ error: mensaje, sesiones: [] });
    } finally {
      set({ cargando: false });
    }
  },

  limpiarHistorial: () =>
    set({
      sesiones: [],
      cargando: false,
      error: null,
    }),
}));
