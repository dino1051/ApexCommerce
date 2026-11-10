import type { DecimalAPI, FechaAPI } from "./api";
import type { Categoria } from "./categoria";

// Datos públicos
export interface ArticuloPublico {
  id: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  precioVenta: DecimalAPI;
  id_categoria: number;
  categoria: Pick<Categoria, "id" | "nombre">;
}

// Datos exclusivos de ADMIN
export interface ArticuloAdmin extends ArticuloPublico {
  precioCompra: DecimalAPI;
  creadoEn: FechaAPI;
}

export interface CrearArticuloDTO {
  nombre: string;
  descripcion?: string;
  stock: number;
  precioVenta: number;
  precioCompra: number;
  id_categoria: number;
}

export type ActualizarArticuloDTO = Partial<CrearArticuloDTO>;
