import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LogOut,
  Store,
  UserRound,
  ReceiptText,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import { usePosStore } from "../store/usePosStore";
import { useMisVentasStore } from "../store/useMisVentasStore";

const opcionesMenu = [
  {
    nombre: "Punto de venta",
    ruta: "/caja/pos",
    icono: ShoppingCart,
  },
  {
    nombre: "Mis ventas",
    ruta: "/caja/mis-ventas",
    icono: ReceiptText,
  },
];

export function CajeroLayout() {
  const navigate = useNavigate();

  const usuario = useAuthStore((state) => state.usuario);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);

  const manejarLogout = () => {
    usePosStore.getState().vaciarCarrito();
    useMisVentasStore.getState().limpiarVentas();
    cerrarSesion();
    navigate("/login", { replace: true });
  };

  const nombreCompleto = usuario
    ? `${usuario.nombre} ${usuario.apellido}`
    : "Cajero";

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 border-b border-[#ebe7e6] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <NavLink to="/caja/pos" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#991b1b] text-white">
              <Store size={22} />
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight">
                Apex Commerce
              </p>

              <p className="text-xs text-[#897b78]">Terminal de ventas</p>
            </div>
          </NavLink>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{nombreCompleto}</p>

              <p className="text-xs text-[#897b78]">Cajero</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff1f2] text-[#991b1b]">
              <UserRound size={20} />
            </div>

            <button
              type="button"
              onClick={manejarLogout}
              className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] px-3 py-2 text-sm font-semibold text-[#59413e] transition-colors hover:bg-red-50 hover:text-red-700"
              title="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navegación del cajero */}
      <nav className="border-b border-[#ebe7e6] bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 px-4 md:px-6">
          {opcionesMenu.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <NavLink
                key={opcion.ruta}
                to={opcion.ruta}
                className={({ isActive }) =>
                  `flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-[#991b1b] text-[#991b1b]"
                      : "border-transparent text-[#766b69] hover:text-[#991b1b]"
                  }`
                }
              >
                <Icono size={18} />
                {opcion.nombre}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Contenido de la ruta activa */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
