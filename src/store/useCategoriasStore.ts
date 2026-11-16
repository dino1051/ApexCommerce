import { create } from "zustand";
import { AxiosError } from "axios";

import { categoriasService } from "../services/categorias";
import type { Categoria, CrearCategoriaDTO } from "../types/categoria";

interface CategoriasState {
  categorias: Categoria[];
  cargando: boolean;
  guardando: boolean;
  error: string | null;

  cargarCategorias: () => Promise<void>;
  crearCategoria: (datos: CrearCategoriaDTO) => Promise<void>;
  limpiarError: () => void;
}

function obtenerMensajeError(
  error: unknown,
  mensajePredeterminado: string,
): string {
  if (error instanceof AxiosError) {
    const mensaje = error.response?.data?.message;

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (Array.isArray(mensaje)) {
      return mensaje.join(", ");
    }
  }

  return mensajePredeterminado;
}

export const useCategoriasStore = create<CategoriasState>()((set, get) => ({
  categorias: [],
  cargando: false,
  guardando: false,
  error: null,

  cargarCategorias: async () => {
    set({
      cargando: true,
      error: null,
    });

    try {
      const categorias = await categoriasService.getTodas();

      set({ categorias });
    } catch (error) {
      set({
        error: obtenerMensajeError(
          error,
          "No fue posible cargar las categorías.",
        ),
      });

      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  crearCategoria: async (datos) => {
    set({
      guardando: true,
      error: null,
    });

    try {
      await categoriasService.crear(datos);

      await get().cargarCategorias();
    } catch (error) {
      set({
        error: obtenerMensajeError(error, "No fue posible crear la categoría."),
      });

      throw error;
    } finally {
      set({ guardando: false });
    }
  },

  limpiarError: () => set({ error: null }),
}));
