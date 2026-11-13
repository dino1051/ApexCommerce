export interface Pos {
  id: number;
  numero: number;
  nombre: string | null;
  activo: boolean;
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

export interface CajeroDisponible {
  id: number;
  nombre: string;
  apellido: string;
  role: string;
}

export interface AbrirCajaDTO {
  id_pos: number;
  id_cajero: number;
  monto_inicial: number;
}

export interface CerrarCajaDTO {
  monto_cierre: number;
}

export interface ResumenCaja {
  sesion: {
    id: number;
    fecha_apertura: string;
    monto_inicial: number;
    pos: {
      numero: number;
      nombre: string | null;
    };
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  ventasPorMetodoPago: {
    tipo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIAQR";
    _sum: {
      total: string | null;
    };
    _count: {
      id: number;
    };
  }[];
  efectivo: {
    montoInicial: number;
    ventasEfectivo: number;
    esperado: number;
  };
}

export interface ResultadoCierreCaja {
  arqueo: {
    montoInicial: number;
    ventasEfectivo: number;
    efectivoEsperado: number;
    efectivoContado: number;
    diferencia: number;
  };
}

export interface SesionCajaHistorial {
  id: number;
  id_pos: number;
  id_usuario_apertura: number;
  fecha_apertura: string;
  fecha_cierre: string | null;
  monto_inicial: string;
  monto_cierre: string | null;
  estado: "ABIERTA" | "CERRADA";
  pos: {
    numero: number;
    nombre: string | null;
  };
  usuario: {
    nombre: string;
    apellido: string;
  };
}

import type { TipoPago } from "./pos";
import type { EstadoVenta } from "./misVentas";

export interface VentaDetalleSesion {
  id: number;
  fecha: string;
  total: string;
  tipo_pago: TipoPago;
  estado: EstadoVenta;
  detallesVenta: {
    id: number;
    cantidadArticulos: number;
    subtotal: string;
    articulo: {
      nombre: string;
    };
  }[];
}

export interface DetalleSesionCaja {
  sesion: {
    id: number;
    estado: "ABIERTA" | "CERRADA";
    fecha_apertura: string;
    fecha_cierre: string | null;
    monto_inicial: number;
    monto_cierre: number | null;
    pos: {
      id: number;
      numero: number;
      nombre: string | null;
    };
    usuario: {
      id: number;
      nombre: string;
      apellido: string;
    };
  };

  resumen: {
    cantidadVentasCompletadas: number;
    totalVentas: number;
    ventasPorMetodo: Record<TipoPago, number>;
    cancelaciones: {
      cantidad: number;
      total: number;
    };
    devoluciones: {
      cantidad: number;
      total: number;
    };
    arqueo: {
      efectivoEsperado: number;
      efectivoContado: number | null;
      diferencia: number | null;
    };
  };

  ventas: VentaDetalleSesion[];
}
