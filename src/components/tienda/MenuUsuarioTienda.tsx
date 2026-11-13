import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  LogOut,
  ShoppingBag,
  ChevronDown,
  LogIn,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useMisPedidosWebStore } from "../../store/useMisPedidosWebStore";

export default function MenuUsuarioTienda() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);

  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.cerrarSesion);

  const limpiarPedidos = useMisPedidosWebStore((state) => state.limpiarPedidos);

  const cerrarSesion = () => {
    limpiarPedidos();
    logout();
    setAbierto(false);

    navigate("/tienda", { replace: true });
  };

  if (!usuario) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] px-3 py-2 text-sm font-semibold text-[#991b1b] hover:bg-[#fff1f2]"
      >
        <LogIn size={18} />
        <span className="hidden sm:inline">Iniciar sesión</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAbierto((actual) => !actual)}
        aria-expanded={abierto}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] px-3 py-2 hover:bg-[#faf8ff]"
      >
        <UserRound size={19} className="text-[#991b1b]" />

        <span className="hidden max-w-28 truncate text-sm font-semibold sm:inline">
          {usuario.nombre}
        </span>

        <ChevronDown size={15} />
      </button>

      {abierto && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="fixed inset-0 z-40 cursor-default"
          />

          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#ebe7e6] bg-white shadow-xl"
          >
            <div className="border-b border-[#ebe7e6] px-4 py-3">
              <p className="truncate text-sm font-bold text-[#131b2e]">
                {usuario.nombre} {usuario.apellido}
              </p>

              <p className="mt-1 truncate text-xs text-[#897b78]">
                {usuario.email}
              </p>
            </div>

            <div className="p-2">
              <Link
                to="/tienda/mis-pedidos"
                role="menuitem"
                onClick={() => setAbierto(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#131b2e] hover:bg-[#faf8ff]"
              >
                <ShoppingBag size={18} />
                Mis pedidos
              </Link>

              <div className="my-2 border-t border-[#ebe7e6]" />

              <button
                type="button"
                role="menuitem"
                onClick={cerrarSesion}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
