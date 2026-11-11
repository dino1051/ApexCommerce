import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layout/AdminLayout";
import { CajeroLayout } from "../layout/CajeroLayout";

import RutaProtegida from "../auth/RutaProtegida";
import RedireccionPorRol from "../auth/RedireccionPorRol";
import LoginPage from "../pages/LoginPage";
import ProductosPage from "../pages/ProductosPage";
import PosPage from "../pages/PosPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import CajeroVentasPage from "../pages/CajeroVentasPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirección según rol */}
        <Route path="/" element={<RedireccionPorRol />} />

        {/* Rutas del administrador */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/productos" element={<ProductosPage />} />
            <Route path="/admin/pos" element={<PosPage />} />
          </Route>
        </Route>

        {/* Rutas del cajero */}
        <Route element={<RutaProtegida rolesPermitidos={["CAJERO"]} />}>
          <Route element={<CajeroLayout />}>
            <Route path="/caja" element={<Navigate to="/caja/pos" replace />} />
            <Route path="/caja/pos" element={<PosPage />} />
            <Route path="/caja/mis-ventas" element={<CajeroVentasPage />} />
          </Route>
        </Route>

        {/* Acceso denegado */}
        <Route
          path="/sin-acceso"
          element={
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#faf8ff] p-6 text-center">
              <h1 className="text-3xl font-bold text-[#991b1b]">
                Acceso denegado
              </h1>

              <p className="text-[#766b69]">
                No tienes permisos para acceder a esta sección.
              </p>

              <a
                href="/"
                className="rounded-lg bg-[#991b1b] px-5 py-3 font-semibold text-white"
              >
                Volver al inicio
              </a>
            </div>
          }
        />

        {/* Rutas desconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
