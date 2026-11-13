import { create } from "zustand";
import { AxiosError } from "axios";

import { cajasService } from "../services/cajas";

import type {
  Pos,
  SesionCajaAbierta,
  CajeroDisponible,
  AbrirCajaDTO,
} from "../types/cajas";

interface CajasState {
  terminales: Pos[];
  sesionesAbiertas: SesionCajaAbierta[];
  cajeros: CajeroDisponible[];

  cargando: boolean;
  procesando: boolean;
  error: string | null;

  cargarDatos: () => Promise<void>;
  abrirCaja: (datos: AbrirCajaDTO) => Promise<void>;
  limpiarDatos: () => void;
}

function obtenerMensajeError(error: unknown): string {
  if (error instanceof AxiosError) {
    const mensaje = error.response?.data?.message;

    if (typeof mensaje === "string") {
      return mensaje;
    }

    if (Array.isArray(mensaje)) {
      return mensaje.join(", ");
    }
  }

  return "Ocurrió un error al procesar la operación.";
}

export const useCajasStore = create<CajasState>()((set, get) => ({
  terminales: [],
  sesionesAbiertas: [],
  cajeros: [],

  cargando: false,
  procesando: false,
  error: null,

  cargarDatos: async () => {
    set({ cargando: true, error: null });

    try {
      const [terminales, sesionesAbiertas, cajeros] = await Promise.all([
        cajasService.obtenerPos(),
        cajasService.obtenerSesionesAbiertas(),
        cajasService.obtenerCajeros(),
      ]);

      set({
        terminales,
        sesionesAbiertas,
        cajeros,
      });
    } catch (error) {
      set({
        error: obtenerMensajeError(error),
      });
    } finally {
      set({ cargando: false });
    }
  },

  abrirCaja: async (datos) => {
    set({ procesando: true, error: null });

    try {
      await cajasService.abrirCaja(datos);
      await get().cargarDatos();
    } catch (error) {
      const mensaje = obtenerMensajeError(error);

      set({ error: mensaje });
      throw new Error(mensaje);
    } finally {
      set({ procesando: false });
    }
  },

  limpiarDatos: () => {
    set({
      terminales: [],
      sesionesAbiertas: [],
      cajeros: [],
      cargando: false,
      procesando: false,
      error: null,
    });
  },
}));
