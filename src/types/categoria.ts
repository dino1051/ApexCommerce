export interface Categoria {
  id: number;
  nombre: string;
  creadoEn: string;
}

export interface CrearCategoriaDTO {
  nombre: string;
}

export type ActualizarCategoriaDTO = Partial<CrearCategoriaDTO>;
