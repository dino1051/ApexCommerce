import type { Role } from "./enums";
import type { FechaAPI } from "./api";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string | null;
  role: Role;
  creadoEn: FechaAPI;
}

export interface CrearUsuarioDTO {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  direccion?: string;
  role?: Role;
}

export type ActualizarUsuarioDTO = Partial<
  Omit<CrearUsuarioDTO, "password">
> & {
  password?: string;
};
