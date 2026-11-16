import { create } from "zustand";
import { AxiosError } from "axios";

import { ventasService } from "../services/ventas";
import type { VentaCajero } from "../types/misVentas";
interface VentasState {
  ventas: VentaCajero[];
  cargando: boolean;
  error: string | null;

  cargarVentas: () => Promise<void>;
  limpiarVentas: () => void;
}

function obtenerError(error: unknown): string {
  if (error instanceof AxiosError) {
    const mensaje = error.response?.data?.message;

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (Array.isArray(mensaje)) {
      return mensaje.join(", ");
    }
  }

  return "No fue posible cargar las ventas.";
}

export const useVentasStore = create<VentasState>()((set) => ({
  ventas: [],
  cargando: false,
  error: null,

  cargarVentas: async () => {
    set({
      cargando: true,
      error: null,
    });

    try {
      const ventas = await ventasService.obtenerTodas();

      set({ ventas });
    } catch (error) {
      set({
        error: obtenerError(error),
      });

      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarVentas: () =>
    set({
      ventas: [],
      error: null,
    }),
}));
