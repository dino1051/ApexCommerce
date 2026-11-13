export type EstadoVenta =
  | "COMPLETADA"
  | "CANCELADA"
  | "DEVUELTA"
  | "DEVUELTA_PARCIAL";

export type EstadoWeb =
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

export type Pagos = "EFECTIVO" | "TARJETA" | "TRANSFERENCIAQR";
export type Role = "ADMIN" | "CAJERO" | "CLIENTEWEB";
export type EstadoSesionCaja = "ABIERTA" | "CERRADA";
