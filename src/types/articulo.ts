import type { DecimalAPI, FechaAPI } from "./api";

// GET /api/articulos
export interface ArticuloResumen {
  id: number;
  nombre: string;
  stock: number;
}

// GET /api/articulos/:id
export interface ArticuloDetalle {
  nombre: string;
  descripcion: string | null;
  stock: number;
  precioVenta: DecimalAPI;
  precioCompra: DecimalAPI;
  creadoEn: FechaAPI;
}

// POST /api/articulos
export interface CrearArticuloDTO {
  nombre: string;
  descripcion?: string;
  stock: number;
  precioVenta: number;
  precioCompra: number;
  id_categoria: number;
}

// PATCH /api/articulos/:id
export type ActualizarArticuloDTO = Partial<CrearArticuloDTO>;
