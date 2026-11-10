import { create } from "zustand";
import { articulosService } from "../services/articulos";

import type {
  ArticuloResumen,
  CrearArticuloDTO,
  ActualizarArticuloDTO,
} from "../types/articulo";

interface ArticulosState {
  articulos: ArticuloResumen[];
  cargando: boolean;
  error: string | null;

  cargarArticulos: () => Promise<void>;
  crearArticulo: (datos: CrearArticuloDTO) => Promise<void>;
  actualizarArticulo: (
    id: number,
    datos: ActualizarArticuloDTO,
  ) => Promise<void>;
  eliminarArticulo: (id: number) => Promise<void>;
}

export const useArticulosStore = create<ArticulosState>()((set, get) => ({
  articulos: [],
  cargando: false,
  error: null,

  cargarArticulos: async () => {
    set({ cargando: true, error: null });

    try {
      const articulos = await articulosService.getTodos();
      set({ articulos });
    } catch {
      set({
        error: "No fue posible cargar los artículos.",
      });
    } finally {
      set({ cargando: false });
    }
  },

  crearArticulo: async (datos) => {
    set({ error: null });

    try {
      await articulosService.crear(datos);
      await get().cargarArticulos();
    } catch (error) {
      set({ error: "No fue posible crear el artículo." });
      throw error;
    }
  },

  actualizarArticulo: async (id, datos) => {
    set({ error: null });

    try {
      await articulosService.actualizar(id, datos);
      await get().cargarArticulos();
    } catch (error) {
      set({ error: "No fue posible actualizar el artículo." });
      throw error;
    }
  },

  eliminarArticulo: async (id) => {
    set({ error: null });

    try {
      await articulosService.eliminar(id);
      await get().cargarArticulos();
    } catch (error) {
      set({ error: "No fue posible eliminar el artículo." });
      throw error;
    }
  },
}));
