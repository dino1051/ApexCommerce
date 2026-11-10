import { create } from "zustand";
import { categoriasService } from "../services/categorias";

import type {
  Categoria,
  CrearCategoriaDTO,
  ActualizarCategoriaDTO,
} from "../types/categoria";

interface CategoriasState {
  categorias: Categoria[];
  cargando: boolean;
  error: string | null;

  cargarCategorias: () => Promise<void>;
  crearCategoria: (datos: CrearCategoriaDTO) => Promise<void>;
  actualizarCategoria: (
    id: number,
    datos: ActualizarCategoriaDTO,
  ) => Promise<void>;
  eliminarCategoria: (id: number) => Promise<void>;
}

export const useCategoriasStore = create<CategoriasState>()((set, get) => ({
  categorias: [],
  cargando: false,
  error: null,

  cargarCategorias: async () => {
    set({ cargando: true, error: null });

    try {
      const categorias = await categoriasService.getTodas();
      set({ categorias });
    } catch {
      set({
        error: "No fue posible cargar las categorías.",
      });
    } finally {
      set({ cargando: false });
    }
  },

  crearCategoria: async (datos) => {
    set({ cargando: true, error: null });

    try {
      await categoriasService.crear(datos);
      await get().cargarCategorias();
    } catch (error) {
      set({ error: "No fue posible crear la categoría." });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  actualizarCategoria: async (id, datos) => {
    set({ cargando: true, error: null });

    try {
      await categoriasService.actualizar(id, datos);
      await get().cargarCategorias();
    } catch (error) {
      set({
        error: "No fue posible actualizar la categoría.",
      });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  eliminarCategoria: async (id) => {
    set({ cargando: true, error: null });

    try {
      await categoriasService.eliminar(id);
      await get().cargarCategorias();
    } catch (error) {
      set({
        error: "No fue posible eliminar la categoría.",
      });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },
}));
