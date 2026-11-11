import { create } from "zustand";

import { misVentasService } from "../services/misVentas";
import type { VentaCajero } from "../types/misVentas";

interface MisVentasState {
  ventas: VentaCajero[];
  cargando: boolean;
  error: string | null;

  cargarVentas: () => Promise<void>;
  limpiarVentas: () => void;
}

export const useMisVentasStore = create<MisVentasState>()((set) => ({
  ventas: [],
  cargando: false,
  error: null,

  cargarVentas: async () => {
    set({ cargando: true, error: null });

    try {
      const ventas = await misVentasService.obtenerTodas();

      set({ ventas });
    } catch (error) {
      console.error("Error al cargar ventas:", error);

      set({
        ventas: [],
        error: "No fue posible cargar tus ventas.",
      });
    } finally {
      set({ cargando: false });
    }
  },

  limpiarVentas: () =>
    set({
      ventas: [],
      cargando: false,
      error: null,
    }),
}));
