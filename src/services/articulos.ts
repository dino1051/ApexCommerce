import { api } from "../lib/axios";
import type { ArticuloPublico, ArticuloAdmin } from "../types/articulo";
import type { ArticuloFormulario } from "../schemas/articulo.schema";

export const articulosService = {
  // Catálogo público
  getTodos: async (): Promise<ArticuloPublico[]> => {
    const { data } = await api.get<ArticuloPublico[]>("/articulos");

    return data;
  },

  // Detalle público
  getPorId: async (id: number): Promise<ArticuloPublico> => {
    const { data } = await api.get<ArticuloPublico>(`/articulos/${id}`);

    return data;
  },

  // Catálogo administrativo
  getTodosAdmin: async (): Promise<ArticuloAdmin[]> => {
    const { data } = await api.get<ArticuloAdmin[]>("/articulos/admin/todos");

    return data;
  },

  crear: async (datos: ArticuloFormulario) => {
    const { data } = await api.post("/articulos", {
      ...datos,
      descripcion: datos.descripcion.trim() || undefined,
    });

    return data;
  },

  actualizar: async (id: number, datos: ArticuloFormulario) => {
    const { data } = await api.patch(`/articulos/${id}`, {
      ...datos,
      descripcion: datos.descripcion.trim() || null,
    });

    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/articulos/${id}`);
  },
};
