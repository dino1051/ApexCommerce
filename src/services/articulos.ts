import { api } from "../lib/axios";

import type {
  ArticuloPublico,
  ArticuloAdmin,
  CrearArticuloDTO,
  ActualizarArticuloDTO,
} from "../types/articulo";

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

  crear: async (datos: CrearArticuloDTO): Promise<ArticuloAdmin> => {
    const { data } = await api.post<ArticuloAdmin>("/articulos", datos);

    return data;
  },

  actualizar: async (
    id: number,
    datos: ActualizarArticuloDTO,
  ): Promise<ArticuloAdmin> => {
    const { data } = await api.patch<ArticuloAdmin>(`/articulos/${id}`, datos);

    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/articulos/${id}`);
  },
};
