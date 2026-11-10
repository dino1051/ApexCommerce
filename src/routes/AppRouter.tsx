import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "../layout/AdminLayout";

import LoginPage from "../pages/LoginPage";
import ProductosPage from "../pages/ProductosPage";

import RutaProtegida from "../auth/RutaProtegida";
import RedireccionPorRol from "../auth/RedireccionPorRol";

function SinAcceso() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <div className="w-full max-w-md rounded-xl border border-border-ui bg-surface p-8 text-center shadow-sm">
        <h1 className="font-heading text-2xl font-bold text-primary">
          Acceso denegado
        </h1>

        <p className="mt-3 text-sm text-ink-secondary">
          No tienes permisos para acceder a esta página.
        </p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />

        {/* REDIRECCIÓN INICIAL */}
        <Route path="/" element={<RedireccionPorRol />} />

        {/* ADMINISTRACIÓN */}
        <Route element={<RutaProtegida rolesPermitidos={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/productos" replace />}
            />

            <Route path="/admin/productos" element={<ProductosPage />} />
          </Route>
        </Route>

        {/* ACCESO DENEGADO */}
        <Route path="/sin-acceso" element={<SinAcceso />} />

        {/* RUTA INEXISTENTE */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
