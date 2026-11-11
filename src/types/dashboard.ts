export type EstadoVenta =
  | "COMPLETADA"
  | "CANCELADA"
  | "DEVUELTA"
  | "DEVUELTA_PARCIAL";

export type TipoPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIAQR";

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

export interface VentaReciente {
  id: number;
  fecha: string;
  total: string;
  tipo_pago: TipoPago;
  estado: EstadoVenta;
}

export interface ResumenDiario {
  cantidadVentas: number;
  totalVendido: string;
  ventasRecientes: VentaReciente[];
}

export interface SesionCajaAbierta {
  id: number;
  id_pos: number;
  id_usuario_apertura: number;
  fecha_apertura: string;
  monto_inicial: string;
  estado: "ABIERTA";

  pos: {
    numero: number;
    nombre: string | null;
  };

  usuario: {
    nombre: string;
    apellido: string;
  };
}

export interface PedidoReciente {
  id: number;
  fecha: string;
  total: string;
  estadoweb: EstadoPedidoWeb;
  estado_pago: EstadoPagoWeb;

  usuario: {
    nombre: string;
    apellido: string;
  };
}

export interface ResumenPedidos {
  pedidosPendientes: number;
  pedidosRecientes: PedidoReciente[];
}
