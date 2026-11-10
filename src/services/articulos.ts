import { api } from "../lib/axios";

import type {
  ArticuloResumen,
  ArticuloDetalle,
  CrearArticuloDTO,
  ActualizarArticuloDTO,
} from "../types/articulo";

export const articulosService = {
  getTodos: async (): Promise<ArticuloResumen[]> => {
    const { data } = await api.get<ArticuloResumen[]>("/articulos");

    return data;
  },

  getPorId: async (id: number): Promise<ArticuloDetalle> => {
    const { data } = await api.get<ArticuloDetalle>(`/articulos/${id}`);

    return data;
  },

  crear: async (datos: CrearArticuloDTO) => {
    const { data } = await api.post("/articulos", datos);

    return data;
  },

  actualizar: async (id: number, datos: ActualizarArticuloDTO) => {
    const { data } = await api.patch(`/articulos/${id}`, datos);

    return data;
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/articulos/${id}`);
  },
};
