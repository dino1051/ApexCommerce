export interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

export interface CrearProveedorDTO {
  nombre: string;
  email: string;
  telefono: string;
}

export type ActualizarProveedorDTO = Partial<CrearProveedorDTO>;
