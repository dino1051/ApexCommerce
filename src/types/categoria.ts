import type { FechaAPI } from "./api";

export interface Categoria {
  id: number;
  nombre: string;
  creadoEn: FechaAPI;
}

export interface CrearCategoriaDTO {
  nombre: string;
}

export type ActualizarCategoriaDTO = Partial<CrearCategoriaDTO>;
