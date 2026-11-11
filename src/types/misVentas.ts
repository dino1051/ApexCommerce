import type { TipoPago } from "./pos";

export type EstadoVenta =
  | "COMPLETADA"
  | "CANCELADA"
  | "DEVUELTA"
  | "DEVUELTA_PARCIAL";

export interface VentaCajero {
  id: number;
  fecha: string;
  total: string;
  tipo_pago: TipoPago;
  estado: EstadoVenta;
  id_usuario: number;
  id_sesion_caja: number;
  usuario: {
    nombre: string;
  };
}
