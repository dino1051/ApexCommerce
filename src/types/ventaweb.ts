import type { DecimalAPI, FechaAPI } from "./api";
import type { EstadoVenta, EstadoWeb, EstadoPagoWeb } from "./enums";
import type { ArticuloPublico } from "./articulo";
import type { Usuario } from "./usuario";

export interface DetalleVentaWeb {
  id: number;
  cantidadArticulos: number;
  subtotal: DecimalAPI;
  id_ventaweb: number;
  id_articulo: number;
  cantidadDevuelta: number;
  articulo?: ArticuloPublico;
}

export interface VentaWeb {
  id: number;
  fecha: FechaAPI;
  total: DecimalAPI;
  estadoweb: EstadoWeb;
  estado_pago: EstadoPagoWeb;
  id_usuario: number;
  id_pago_externo: string | null;
  estado: EstadoVenta;

  detallesventaweb?: DetalleVentaWeb[];
  usuario?: Usuario;
}

export interface CrearDetalleVentaWebDTO {
  id_articulo: number;
  cantidadArticulos: number;
}

export interface CrearVentaWebDTO {
  detallesventaweb: CrearDetalleVentaWebDTO[];
}

export interface ActualizarEstadoWebDTO {
  estadoweb: EstadoWeb;
}
