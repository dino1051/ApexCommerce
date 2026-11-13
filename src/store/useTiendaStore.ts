import { create } from "zustand";
import { AxiosError } from "axios";

import { tiendaService } from "../services/tienda";
import type { ProductoTienda } from "../types/tienda";

interface TiendaState {
  productos: ProductoTienda[];
  cargando: boolean;
  error: string | null;

  cargarProductos: () => Promise<void>;
  limpiarProductos: () => void;
}

export const useTiendaStore = create<TiendaState>()((set) => ({
  productos: [],
  cargando: false,
  error: null,

  cargarProductos: async () => {
    set({
      cargando: true,
      error: null,
    });

    try {
      const productos = await tiendaService.obtenerProductos();

      set({ productos });
    } catch (error) {
      let mensaje = "No fue posible cargar los productos.";

      if (error instanceof AxiosError) {
        const respuesta = error.response?.data?.message;

        if (typeof respuesta === "string") {
          mensaje = respuesta;
        }
      }

      set({
        productos: [],
        error: mensaje,
      });
    } finally {
      set({ cargando: false });
    }
  },

  limpiarProductos: () =>
    set({
      productos: [],
      cargando: false,
      error: null,
    }),
}));
