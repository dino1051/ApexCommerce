import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import type { Rol } from "../types/auth";

export const rutasPorRol: Record<Rol, string> = {
  ADMIN: "/admin/productos",
  CAJERO: "/caja",
  CLIENTEWEB: "/tienda",
};

export default function RedireccionPorRol() {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);

  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={rutasPorRol[usuario.rol] ?? "/sin-acceso"} replace />;
}
