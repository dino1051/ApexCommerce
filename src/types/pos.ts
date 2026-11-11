export type TipoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIAQR";

export interface ArticuloPos {
  id: number;
  nombre: string;
  descripcion: string | null;
  stock: number;
  precioVenta: string;
  id_categoria: number;
  categoria: {
    id: number;
    nombre: string;
  };
}

export interface ItemCarrito {
  articulo: ArticuloPos;
  cantidad: number;
}

export interface DetalleVentaDTO {
  id_articulo: number;
  cantidadArticulos: number;
}

export interface CrearVentaDTO {
  tipo_pago: TipoPago;
  detalles: DetalleVentaDTO[];
}

export interface VentaCreada {
  fecha: string;
  total: string;
  tipo_pago: TipoPago;
  detallesVenta: {
    cantidadArticulos: number;
    subtotal: string;
    articulo: {
      nombre: string;
      precioVenta: string;
    };
  }[];
  usuario: {
    nombre: string;
  };
  sesionCaja: {
    id_pos: number;
  };
}
