import type { DecimalAPI, FechaAPI } from "./api";
import type { EstadoSesionCaja } from "./enums";
import type { Usuario } from "./usuario";
import type { Venta } from "./venta";

export interface Pos {
  id: number;
  numero: number;
  nombre: string | null;
  activo: boolean;
}

export interface SesionCaja {
  id: number;
  id_pos: number;
  id_usuario_apertura: number;

  fecha_apertura: FechaAPI;
  monto_inicial: DecimalAPI;

  fecha_cierre: FechaAPI | null;
  monto_cierre: DecimalAPI | null;

  estado: EstadoSesionCaja;

  pos?: Pos;
  usuario?: Usuario;
  ventas?: Venta[];
}

export interface CrearPosDTO {
  numero: number;
  nombre?: string;
  activo?: boolean;
}

export interface AbrirCajaDTO {
  id_pos: number;
  monto_inicial: number;
}

export interface CerrarCajaDTO {
  monto_cierre: number;
}
