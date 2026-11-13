import { api } from "../lib/axios";

import type {
  Pos,
  SesionCajaAbierta,
  CajeroDisponible,
  AbrirCajaDTO,
  CerrarCajaDTO,
  ResumenCaja,
  ResultadoCierreCaja,
  SesionCajaHistorial,
  DetalleSesionCaja,
} from "../types/cajas";

export const cajasService = {
  obtenerPos: async (): Promise<Pos[]> => {
    const { data } = await api.get<Pos[]>("/pos");
    return data;
  },

  obtenerCajeros: async (): Promise<CajeroDisponible[]> => {
    const { data } = await api.get<CajeroDisponible[]>("/auth/usuarios");

    return data.filter((usuario) => usuario.role === "CAJERO");
  },

  obtenerSesionesAbiertas: async (): Promise<SesionCajaAbierta[]> => {
    const { data } = await api.get<SesionCajaAbierta[]>(
      "/sesiones-caja/abiertas",
    );

    return data;
  },

  abrirCaja: async (datos: AbrirCajaDTO) => {
    const { data } = await api.post("/sesiones-caja/abrir", datos);

    return data;
  },

  obtenerResumen: async (id: number): Promise<ResumenCaja> => {
    const { data } = await api.get<ResumenCaja>(`/sesiones-caja/${id}/resumen`);

    return data;
  },

  cerrarCaja: async (
    id: number,
    datos: CerrarCajaDTO,
  ): Promise<ResultadoCierreCaja> => {
    const { data } = await api.post<ResultadoCierreCaja>(
      `/sesiones-caja/${id}/cerrar`,
      datos,
    );

    return data;
  },

  obtenerHistorial: async (): Promise<SesionCajaHistorial[]> => {
    const { data } = await api.get<SesionCajaHistorial[]>(
      "/sesiones-caja/historial",
    );

    return data;
  },

  obtenerDetalle: async (id: number): Promise<DetalleSesionCaja> => {
    const { data } = await api.get<DetalleSesionCaja>(
      `/sesiones-caja/${id}/detalle`,
    );

    return data;
  },
};
