import { Menu, Bell } from "lucide-react";

interface AdminHeaderProps {
  titulo?: string;
  onMenuClick?: () => void;
}

export const AdminHeader = ({
  titulo = "Dashboard",
  onMenuClick,
}: AdminHeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      {/* Parte izquierda */}
      <div className="flex items-center gap-4">
        {/* Botón menú móvil */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        {/* Título */}
        <h1 className="text-lg font-semibold text-slate-800">{titulo}</h1>
      </div>

      {/* Parte derecha */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button
          type="button"
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell size={20} />

          {/* Indicador */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
        </button>

        {/* Usuario */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-semibold">
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-800">
              Administrador
            </p>
            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </div>
      </div>
    </header>
  );
};
