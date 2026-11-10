import type { DecimalAPI, FechaAPI } from "./api";
import type { DetalleVenta } from "./venta";
import type { DetalleVentaWeb } from "./ventaweb";

export interface DetalleDevolucion {
  id: number;
  cantidad: number;
  subtotal: DecimalAPI;
  id_devolucion: number;
  id_detalle_venta: number;
  detalleVenta?: DetalleVenta;
}

export interface Devolucion {
  id: number;
  fecha: FechaAPI;
  total: DecimalAPI;
  id_venta: number;
  detalles?: DetalleDevolucion[];
}

export interface DetalleDevolucionWeb {
  id: number;
  cantidad: number;
  subtotal: DecimalAPI;
  id_devolucion: number;
  id_detalle_venta: number;
  detalleVentaweb?: DetalleVentaWeb;
}

export interface DevolucionWeb {
  id: number;
  fecha: FechaAPI;
  total: DecimalAPI;
  id_ventaweb: number;
  detalles?: DetalleDevolucionWeb[];
}

export interface CrearDetalleDevolucionDTO {
  id_detalle_venta: number;
  cantidad: number;
}

export interface CrearDevolucionDTO {
  id_venta: number;
  detalles: CrearDetalleDevolucionDTO[];
}

export interface CrearDevolucionWebDTO {
  id_ventaweb: number;
  detalles: CrearDetalleDevolucionDTO[];
}
