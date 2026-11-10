import { api } from "../lib/axios";

import type {
  Categoria,
  CrearCategoriaDTO,
  ActualizarCategoriaDTO,
} from "../types/categoria";

export const categoriasService = {
  getTodas: async (): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>("/categorias");
    return data;
  },

  crear: async (datos: CrearCategoriaDTO): Promise<Categoria> => {
    const { data } = await api.post<Categoria>("/categorias", datos);

    return data;
  },

  actualizar: async (
    id: number,
    datos: ActualizarCategoriaDTO,
  ): Promise<Categoria> => {
    const { data } = await api.patch<Categoria>(`/categorias/${id}`, datos);

    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};
