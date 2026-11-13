import type {
  EstadoPedidoWeb,
  EstadoPagoWeb,
  EstadoVentaWeb,
} from "./ventasWeb";

export interface ArticuloMiPedido {
  id: number;
  nombre: string;
}

export interface DetalleMiPedido {
  id: number;
  cantidadArticulos: number;
  cantidadDevuelta?: number;
  subtotal: string;
  articulo: ArticuloMiPedido;
}

export interface MiPedidoWeb {
  id: number;
  fecha: string;
  total: string;
  estadoweb: EstadoPedidoWeb;
  estado_pago: EstadoPagoWeb;
  estado: EstadoVentaWeb;
  detallesventaweb: DetalleMiPedido[];
}
