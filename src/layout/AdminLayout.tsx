import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

const titulos: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/productos": "Productos",
  "/admin/categorias": "Categorías",
  "/admin/usuarios": "Usuarios",
  "/admin/ventas": "Ventas",
  "/admin/reportes": "Reportes",
};

export function AdminLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const location = useLocation();

  const titulo = titulos[location.pathname] ?? "Administración";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <AdminSidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <div className="lg:pl-72">
        <AdminHeader
          titulo={titulo}
          onMenuClick={() => setSidebarAbierto(true)}
        />

        <main className="min-h-screen pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
