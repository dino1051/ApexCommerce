import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../store/useAuthStore";
import type { Rol } from "../types/auth";

interface RutaProtegidaProps {
  rolesPermitidos?: Rol[];
}

export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const token = useAuthStore((state) => state.token);
  const usuario = useAuthStore((state) => state.usuario);
  const sesionVerificada = useAuthStore((state) => state.sesionVerificada);
  const location = useLocation();
  // InicializarAuth normalmente espera a que esto termine.
  if (!sesionVerificada) {
    return null;
  }

  // Usuario sin sesión.
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Usuario sin permisos.
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname + location.search + location.hash,
        }}
        replace
      />
    );
  }

  return <Outlet />;
}
