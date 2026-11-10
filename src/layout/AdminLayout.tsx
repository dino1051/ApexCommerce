import { Outlet } from "react-router-dom";
import { useState } from "react";

import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      <AdminSidebar
        abierto={sidebarAbierto}
        onCerrar={() => setSidebarAbierto(false)}
      />

      <div className="lg:pl-72">
        <AdminHeader
          titulo="Dashboard"
          onMenuClick={() => setSidebarAbierto(true)}
        />
        <main className="pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
