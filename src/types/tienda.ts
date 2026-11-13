export interface CategoriaTienda {
  id: number;
  nombre: string;
}

export interface ProductoTienda {
  id: number;
  nombre: string;
  descripcion: string | null;
  precioVenta: string;
  stock: number;
  id_categoria: number;
  categoria?: CategoriaTienda | null;
}
