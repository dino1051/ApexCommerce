import { Menu, Bell } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

interface AdminHeaderProps {
  titulo?: string;
  onMenuClick?: () => void;
}

export const AdminHeader = ({
  titulo = "Dashboard",
  onMenuClick,
}: AdminHeaderProps) => {
  const usuario = useAuthStore((state) => state.usuario);

  const nombreCompleto = usuario
    ? `${usuario.nombre} ${usuario.apellido}`.trim()
    : "Usuario";

  const inicial = usuario?.nombre?.charAt(0).toUpperCase() ?? "U";

  const rol =
    usuario?.rol === "ADMIN"
      ? "Administrador"
      : usuario?.rol === "CAJERO"
        ? "Cajero"
        : "Cliente";

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-[#e5e1e0] bg-white px-4 md:px-6 lg:left-72">
      {/* PARTE IZQUIERDA */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#59413e] transition-colors hover:bg-[#f2f3ff] lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold text-[#131b2e]">{titulo}</h1>
      </div>

      {/* PARTE DERECHA */}
      <div className="flex items-center gap-3">
        {/* Icono informativo, sin acción hasta implementar notificaciones */}
        <span
          className="rounded-lg p-2 text-[#59413e]"
          title="Notificaciones"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
        </span>

        {/* USUARIO */}
        <div className="hidden items-center gap-3 border-l border-[#e5e1e0] pl-3 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 font-semibold text-[#991b1b]">
            {inicial}
          </div>

          <div className="hidden md:block">
            <p className="max-w-44 truncate text-sm font-semibold text-[#131b2e]">
              {nombreCompleto}
            </p>

            <p className="text-xs text-[#59413e]">{rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
