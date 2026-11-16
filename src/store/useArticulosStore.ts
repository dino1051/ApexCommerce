import { create } from "zustand";
import { articulosService } from "../services/articulos";

import type { ArticuloAdmin } from "../types/articulo";
import type { ArticuloFormulario } from "../schemas/articulo.schema";

interface ArticulosState {
  articulos: ArticuloAdmin[];
  cargando: boolean;
  guardando: boolean;
  error: string | null;

  cargarArticulos: () => Promise<void>;
  crearArticulo: (datos: ArticuloFormulario) => Promise<void>;
  actualizarArticulo: (id: number, datos: ArticuloFormulario) => Promise<void>;
  eliminarArticulo: (id: number) => Promise<void>;
}

export const useArticulosStore = create<ArticulosState>()((set, get) => ({
  articulos: [],
  cargando: false,
  guardando: false,
  error: null,

  cargarArticulos: async () => {
    set({ cargando: true, error: null });

    try {
      const articulos = await articulosService.getTodosAdmin();
      set({ articulos });
    } catch (error) {
      set({ error: "No fue posible cargar los artículos." });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  crearArticulo: async (datos) => {
    set({
      guardando: true,
      error: null,
    });

    try {
      await articulosService.crear(datos);

      await get().cargarArticulos();
    } catch (error) {
      set({
        error: "No fue posible crear el producto.",
      });

      throw error;
    } finally {
      set({
        guardando: false,
      });
    }
  },

  actualizarArticulo: async (id, datos) => {
    set({
      guardando: true,
      error: null,
    });

    try {
      await articulosService.actualizar(id, datos);

      await get().cargarArticulos();
    } catch (error) {
      set({
        error: "No fue posible actualizar el producto.",
      });

      throw error;
    } finally {
      set({
        guardando: false,
      });
    }
  },

  eliminarArticulo: async (id) => {
    set({ guardando: true, error: null });

    try {
      await articulosService.eliminar(id);
      await get().cargarArticulos();
    } catch (error) {
      set({ error: "No fue posible eliminar el artículo." });
      throw error;
    } finally {
      set({ guardando: false });
    }
  },
}));
