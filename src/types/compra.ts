import type { DecimalAPI, FechaAPI } from "./api";
import type { Pagos } from "./enums";
import type { Proveedor } from "./proveedor";
import type { Usuario } from "./usuario";
import type { ArticuloAdmin } from "./articulo";

export interface DetalleCompra {
  id: number;
  cantidadArticulos: number;
  subtotal: DecimalAPI;
  id_compra: number;
  id_articulo: number;
  articulo?: ArticuloAdmin;
}

export interface Compra {
  id: number;
  fecha: FechaAPI;
  total: DecimalAPI;
  tipo_pago: Pagos;
  id_proveedor: number;
  id_usuario: number;

  detallescompra?: DetalleCompra[];
  proveedores?: Proveedor;
  usuarios?: Usuario;
}

export interface CrearDetalleCompraDTO {
  id_articulo: number;
  cantidadArticulos: number;
}

export interface CrearCompraDTO {
  id_proveedor: number;
  tipo_pago: Pagos;
  detallescompra: CrearDetalleCompraDTO[];
}
