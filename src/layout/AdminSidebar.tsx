import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Package,
  Tags,
  ReceiptText,
  Truck,
  Wallet,
  ContactRound,
  Store,
  X,
  LogOut,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePosStore } from "../store/usePosStore";

interface AdminSidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface OpcionMenu {
  nombre: string;
  ruta: string;
  icono: LucideIcon;
}

const operaciones: OpcionMenu[] = [
  {
    nombre: "Dashboard",
    ruta: "/admin/dashboard",
    icono: LayoutDashboard,
  },
  {
    nombre: "POS Mostrador",
    ruta: "/admin/pos",
    icono: Monitor,
  },
  {
    nombre: "Productos",
    ruta: "/admin/productos",
    icono: Package,
  },
  {
    nombre: "Categorías",
    ruta: "/admin/categorias",
    icono: Tags,
  },
  {
    nombre: "Ventas",
    ruta: "/admin/ventas",
    icono: ReceiptText,
  },
  {
    nombre: "Pedidos",
    ruta: "/admin/pedidos",
    icono: Truck,
  },
  {
    nombre: "Caja",
    ruta: "/admin/caja",
    icono: Wallet,
  },
];

const administracion: OpcionMenu[] = [
  {
    nombre: "Usuarios Staff",
    ruta: "/admin/usuarios",
    icono: ContactRound,
  },
];

export function AdminSidebar({ abierto, onCerrar }: AdminSidebarProps) {
  const navigate = useNavigate();

  const usuario = useAuthStore((state) => state.usuario);
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion);

  const nombreCompleto = usuario
    ? `${usuario.nombre} ${usuario.apellido}`.trim()
    : "Usuario";

  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? "U";

  const nombreRol: Record<string, string> = {
    ADMIN: "Administrador",
    CAJERO: "Cajero",
    CLIENTEWEB: "Cliente",
  };

  const rol = usuario ? (nombreRol[usuario.rol] ?? usuario.rol) : "Sin rol";

  const manejarLogout = () => {
    usePosStore.getState().vaciarCarrito();
    cerrarSesion();
    onCerrar();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* OVERLAY MÓVIL */}
      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onCerrar}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-[#e5e1e0]
          bg-white
          transform transition-transform duration-200
          lg:translate-x-0
          ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center justify-between border-b border-[#e5e1e0] px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#991b1b]">
              <Store size={21} className="text-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#131b2e]">
                Apex Commerce
              </span>

              <span className="text-[10px] font-bold uppercase tracking-widest text-[#760009]">
                Administración
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg p-2 text-[#59413e] hover:bg-[#f2f3ff] lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <div className="flex-1 overflow-y-auto py-4">
          <MenuSection
            titulo="Operaciones"
            opciones={operaciones}
            onNavigate={onCerrar}
          />

          <MenuSection
            titulo="Administración"
            opciones={administracion}
            onNavigate={onCerrar}
          />
        </div>

        {/* PERFIL Y SESIÓN */}
        <div className="space-y-3 border-t border-[#e5e1e0] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#f2f3ff] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#991b1b] font-bold text-white">
              {inicial}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#131b2e]">
                {nombreCompleto}
              </p>

              <p className="text-xs text-[#59413e]">{rol}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={manejarLogout}
            className="
              flex w-full items-center gap-3
              rounded-lg px-3 py-2.5
              text-sm font-semibold text-[#991b1b]
              transition-colors
              hover:bg-red-50
            "
          >
            <LogOut size={19} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

interface MenuSectionProps {
  titulo: string;
  opciones: OpcionMenu[];
  onNavigate: () => void;
}

function MenuSection({ titulo, opciones, onNavigate }: MenuSectionProps) {
  return (
    <section className="mb-6">
      <div className="mb-2 px-5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#59413e]">
          {titulo}
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {opciones.map((opcion) => {
          const Icono = opcion.icono;

          return (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              onClick={onNavigate}
              className={({ isActive }) => `
                flex items-center gap-3
                rounded-lg px-3 py-2.5
                text-sm transition-colors
                ${
                  isActive
                    ? "bg-[#991b1b] font-bold text-white"
                    : "text-[#59413e] hover:bg-[#f2f3ff] hover:text-[#131b2e]"
                }
              `}
            >
              <Icono size={20} strokeWidth={1.9} />
              <span>{opcion.nombre}</span>
            </NavLink>
          );
        })}
      </nav>
    </section>
  );
}
