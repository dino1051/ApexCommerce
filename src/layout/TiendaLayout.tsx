import { Outlet, NavLink, Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import { useCarritoWebStore } from "../store/useCarritoWebStore";
import { useAuthStore } from "../store/useAuthStore";
import MenuUsuarioTienda from "../components/tienda/MenuUsuarioTienda";

export default function TiendaLayout() {
  const productos = useCarritoWebStore((state) => state.productos);
  const usuario = useAuthStore((state) => state.usuario);

  const cantidad = productos.reduce(
    (total, producto) => total + producto.cantidad,
    0,
  );

  const claseEnlace = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? "text-[#991b1b]" : "text-[#766b69] hover:text-[#991b1b]"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8ff] text-[#131b2e]">
      <header className="sticky top-0 z-40 border-b border-[#ebe7e6] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/tienda" className="flex items-center gap-3 font-bold">
            <span className="rounded-lg bg-[#991b1b] p-2 text-white">
              <ShoppingBag size={21} />
            </span>

            <span className="hidden text-xl sm:inline">Apex Commerce</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/tienda" end className={claseEnlace}>
              Inicio
            </NavLink>

            <NavLink to="/tienda/productos" className={claseEnlace}>
              Productos
            </NavLink>

            {usuario?.rol === "CLIENTEWEB" && (
              <NavLink to="/tienda/mis-pedidos" className={claseEnlace}>
                Mis pedidos
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/tienda/carrito"
              className="relative rounded-lg p-2 hover:bg-[#fff1f2]"
              aria-label={`Carrito con ${cantidad} artículos`}
            >
              <ShoppingCart size={23} />

              {cantidad > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#991b1b] px-1 text-xs font-bold text-white">
                  {cantidad}
                </span>
              )}
            </Link>

            <MenuUsuarioTienda />
          </div>
        </div>

        <nav className="flex items-center justify-center gap-6 border-t border-[#ebe7e6] py-3 md:hidden">
          <NavLink to="/tienda" end className={claseEnlace}>
            Inicio
          </NavLink>

          <NavLink to="/tienda/productos" className={claseEnlace}>
            Productos
          </NavLink>

          {usuario?.rol === "CLIENTEWEB" && (
            <NavLink to="/tienda/mis-pedidos" className={claseEnlace}>
              Mis pedidos
            </NavLink>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-[#ebe7e6] bg-white px-4 py-8 text-center text-sm text-[#897b78]">
        © {new Date().getFullYear()} Apex Commerce. Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
