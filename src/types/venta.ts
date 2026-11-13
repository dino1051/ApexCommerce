import type { DecimalAPI, FechaAPI } from "./api";
import type { EstadoVenta, Pagos } from "./enums";
import type { ArticuloPublico } from "./articulo";
import type { Usuario } from "./usuario";

export interface DetalleVenta {
  id: number;
  cantidadArticulos: number;
  subtotal: DecimalAPI;
  id_venta: number;
  id_articulo: number;
  cantidadDevuelta: number;
  articulo?: ArticuloPublico;
}

export interface Venta {
  id: number;
  fecha: FechaAPI;
  total: DecimalAPI;
  id_usuario: number;
  id_sesion_caja: number;
  tipo_pago: Pagos;
  estado: EstadoVenta;

  detallesVenta?: DetalleVenta[];
  usuario?: Usuario;
}

export interface CrearDetalleVentaDTO {
  id_articulo: number;
  cantidadArticulos: number;
}

export interface CrearVentaDTO {
  id_sesion_caja: number;
  tipo_pago: Pagos;
  detallesVenta: CrearDetalleVentaDTO[];
}
