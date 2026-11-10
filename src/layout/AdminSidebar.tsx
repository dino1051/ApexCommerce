import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  abierto: boolean;
  onCerrar: () => void;
}

interface OpcionMenu {
  nombre: string;
  ruta: string;
  icono: string;
}

const operaciones: OpcionMenu[] = [
  {
    nombre: "Dashboard",
    ruta: "/admin/dashboard",
    icono: "dashboard",
  },
  {
    nombre: "POS Mostrador",
    ruta: "/admin/pos",
    icono: "point_of_sale",
  },
  {
    nombre: "Productos",
    ruta: "/admin/productos",
    icono: "inventory_2",
  },
  {
    nombre: "Categorías",
    ruta: "/admin/categorias",
    icono: "category",
  },
  {
    nombre: "Ventas",
    ruta: "/admin/ventas",
    icono: "receipt_long",
  },
  {
    nombre: "Pedidos",
    ruta: "/admin/pedidos",
    icono: "local_shipping",
  },
  {
    nombre: "Caja",
    ruta: "/admin/caja",
    icono: "account_balance_wallet",
  },
];

const administracion: OpcionMenu[] = [
  {
    nombre: "Usuarios Staff",
    ruta: "/admin/usuarios",
    icono: "badge",
  },
];

export function AdminSidebar({ abierto, onCerrar }: AdminSidebarProps) {
  return (
    <>
      {/* Overlay móvil */}
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
          w-72
          bg-white
          border-r border-[#e5e1e0]
          flex flex-col
          transform transition-transform duration-200
          lg:translate-x-0
          ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="h-16 px-5 border-b border-[#e5e1e0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#991b1b] flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                storefront
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">
                Apex Commerce
              </span>

              <span className="text-[10px] text-[#760009] uppercase tracking-widest font-bold">
                Administración
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="lg:hidden p-2 rounded-lg hover:bg-[#f2f3ff]"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined">close</span>
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

        {/* PERFIL / SESIÓN */}
        <div className="p-4 border-t border-[#e5e1e0]">
          <div className="bg-[#f2f3ff] rounded-lg p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#991b1b] text-white flex items-center justify-center font-bold">
              A
            </div>

            <div className="min-w-0">
              <p className="text-sm font-bold truncate">Administrador</p>

              <p className="text-xs text-[#59413e]">Administrador</p>
            </div>
          </div>
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
      <div className="px-5 mb-2">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#59413e]">
          {titulo}
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {opciones.map((opcion) => (
          <NavLink
            key={opcion.ruta}
            to={opcion.ruta}
            onClick={onNavigate}
            className={({ isActive }) =>
              `
              flex items-center gap-3
              px-3 py-2.5
              rounded-lg
              text-sm
              transition-colors
              ${
                isActive
                  ? "bg-[#991b1b] text-white font-bold"
                  : "text-[#59413e] hover:bg-[#f2f3ff] hover:text-[#131b2e]"
              }
              `
            }
          >
            <span className="material-symbols-outlined text-[20px]">
              {opcion.icono}
            </span>

            <span>{opcion.nombre}</span>
          </NavLink>
        ))}
      </nav>
    </section>
  );
}
