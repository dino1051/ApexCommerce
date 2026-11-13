import { create } from "zustand";
import { AxiosError } from "axios";

import { ventasWebService } from "../services/ventasWeb";
import type { VentaWeb, EstadoPedidoWeb } from "../types/ventasWeb";

interface VentasWebState {
  ventas: VentaWeb[];
  cargando: boolean;
  error: string | null;
  procesando: boolean;

  actualizarEstado: (id: number, estado: EstadoPedidoWeb) => Promise<void>;

  cargarVentas: () => Promise<void>;
  limpiarVentas: () => void;
}

export const useVentasWebStore = create<VentasWebState>()((set) => ({
  ventas: [],
  cargando: false,
  error: null,
  procesando: false,
  cargarVentas: async () => {
    set({
      cargando: true,
      error: null,
    });
    try {
      const ventas = await ventasWebService.obtenerTodas();

      set({ ventas });
    } catch (error) {
      let mensaje = "No fue posible cargar las ventas web.";

      if (error instanceof AxiosError) {
        const respuesta = error.response?.data?.message;

        if (typeof respuesta === "string") {
          mensaje = respuesta;
        }
      }

      set({
        ventas: [],
        error: mensaje,
      });
    } finally {
      set({ cargando: false });
    }
  },

  actualizarEstado: async (id, estado) => {
    set({ procesando: true });

    try {
      await ventasWebService.actualizarEstado(id, estado);

      const ventas = await ventasWebService.obtenerTodas();

      set({
        ventas,
        error: null,
      });
    } catch (error) {
      let mensaje = "No fue posible actualizar el pedido.";

      if (error instanceof AxiosError) {
        const respuesta = error.response?.data?.message;

        if (typeof respuesta === "string") {
          mensaje = respuesta;
        }
      }

      throw new Error(mensaje);
    } finally {
      set({ procesando: false });
    }
  },

  limpiarVentas: () => {
    set({
      ventas: [],
      cargando: false,
      error: null,
    });
  },
}));
