import { create } from "zustand";
import { articulosService } from "../services/articulos";
import type { ArticuloPublico } from "../types/articulo";

interface CatalogoState {
  productos: ArticuloPublico[];
  cargando: boolean;
  error: string | null;

  cargarCatalogo: () => Promise<void>;
}

export const useCatalogoStore = create<CatalogoState>()((set) => ({
  productos: [],
  cargando: false,
  error: null,

  cargarCatalogo: async () => {
    set({ cargando: true, error: null });

    try {
      const productos = await articulosService.getTodos();
      set({ productos });
    } catch (error) {
      set({ error: "No fue posible cargar el catálogo." });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },
}));
