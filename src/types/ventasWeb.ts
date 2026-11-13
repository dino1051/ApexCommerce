export type EstadoPedidoWeb =
  | "PENDIENTE"
  | "PAGADO"
  | "EN_CAMINO"
  | "ENTREGADO"
  | "CANCELADO";

export type EstadoPagoWeb =
  | "PENDIENTE"
  | "PAGADO"
  | "RECHAZADO"
  | "REEMBOLSADO";

export type EstadoVentaWeb =
  | "COMPLETADA"
  | "CANCELADA"
  | "DEVUELTA"
  | "DEVUELTA_PARCIAL";

export interface ClienteVentaWeb {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface VentaWeb {
  id: number;
  fecha: string;
  total: string;
  estadoweb: EstadoPedidoWeb;
  estado_pago: EstadoPagoWeb;
  estado: EstadoVentaWeb;
  id_pago_externo: string | null;

  usuario: ClienteVentaWeb;

  _count: {
    detallesventaweb: number;
  };
}

export interface DetalleArticuloVentaWeb {
  id: number;
  cantidadArticulos: number;
  cantidadDevuelta: number;
  subtotal: string;

  articulo: {
    id: number;
    nombre: string;
    precioVenta: string;
  };
}

export interface VentaWebDetalle {
  id: number;
  fecha: string;
  total: string;
  estadoweb: EstadoPedidoWeb;
  estado_pago: EstadoPagoWeb;
  estado: EstadoVentaWeb;
  id_pago_externo: string | null;

  usuario: ClienteVentaWeb;

  detallesventaweb: DetalleArticuloVentaWeb[];

  devolucion: unknown[];
}
