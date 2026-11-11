import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layout/AdminLayout";

import LoginPage from "../pages/LoginPage";
import ProductosPage from "../pages/ProductosPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";

import RutaProtegida from "../auth/RutaProtegida";
import RedireccionPorRol from "../auth/RedireccionPorRol";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />

        {/* RUTA INICIAL */}
        <Route path="/" element={<RedireccionPorRol />} />

        {/* ADMINISTRACIÓN */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            <Route path="/admin/productos" element={<ProductosPage />} />
          </Route>
        </Route>

        {/* ACCESO DENEGADO */}
        <Route
          path="/sin-acceso"
          element={
            <div className="flex min-h-screen items-center justify-center p-6">
              <h1 className="text-2xl font-bold text-red-800">
                Acceso denegado
              </h1>
            </div>
          }
        />

        {/* RUTA INEXISTENTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
