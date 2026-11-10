export type Rol = "ADMIN" | "CAJERO" | "CLIENTEWEB";

export interface UsuarioAuth {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: Rol;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioAuth;
}
