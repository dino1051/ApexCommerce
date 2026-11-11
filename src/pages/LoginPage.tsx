import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Shield,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  UserPlus,
  ChevronRight,
  Store,
  Monitor,
  Settings,
  Route,
  LoaderCircle,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import type { LoginDTO, Rol } from "../types/auth";

const rutasPorRol: Record<Rol, string> = {
  ADMIN: "/admin/productos",
  CAJERO: "/caja",
  CLIENTEWEB: "/tienda",
};

const roles = [
  {
    rol: "ADMIN",
    nombre: "Administrador",
    ruta: "/admin/productos",
    descripcion: "Catálogo, usuarios, pedidos, caja y reportes.",
    Icono: Settings,
  },
  {
    rol: "CAJERO",
    nombre: "Cajero",
    ruta: "/caja",
    descripcion: "POS, ventas, pedidos e historial.",
    Icono: Monitor,
  },
  {
    rol: "CLIENTEWEB",
    nombre: "Cliente Web",
    ruta: "/tienda",
    descripcion: "Catálogo, carrito, checkout y pedidos.",
    Icono: Store,
  },
] as const;

export default function LoginPage() {
  const navigate = useNavigate();

  const [mostrarError, setMostrarError] = useState(true);
  const token = useAuthStore((s) => s.token);
  const usuario = useAuthStore((s) => s.usuario);
  const cargando = useAuthStore((s) => s.cargando);
  const error = useAuthStore((s) => s.error);
  const iniciarSesion = useAuthStore((s) => s.iniciarSesion);
  const limpiarError = useAuthStore((s) => s.limpiarError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Evita mostrar el login a usuarios ya autenticados.
  if (token && usuario) {
    return <Navigate to={rutasPorRol[usuario.rol] ?? "/sin-acceso"} replace />;
  }

  const manejarLogin = async (datos: LoginDTO) => {
    try {
      setMostrarError(true);

      await iniciarSesion(datos);

      const usuarioAutenticado = useAuthStore.getState().usuario;

      if (!usuarioAutenticado) {
        return;
      }

      const destino = rutasPorRol[usuarioAutenticado.rol];

      navigate(destino ?? "/sin-acceso", {
        replace: true,
      });
    } catch {}
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {/* HEADER */}
      <header className="w-full border-b border-border-ui bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/tienda"
            className="flex items-center gap-2 text-sm font-semibold text-ink-secondary transition-colors hover:text-primary"
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Tienda Pública</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Store size={19} />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-heading text-xl font-extrabold tracking-tight">
                APEX
              </span>

              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Commerce
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex w-full flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full justify-center">
            {/* FORMULARIO */}
            <section className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border-ui bg-surface p-6 shadow-sm sm:p-8">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />

              <div className="mb-6 pt-1">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    Acceso al sistema
                  </span>
                </div>

                <h1 className="font-heading text-3xl font-extrabold tracking-tight">
                  Iniciar sesión
                </h1>

                <p className="mt-2 text-sm text-ink-secondary">
                  Ingresa tus credenciales para acceder al portal APEX
                </p>
              </div>

              {/* ERROR DEL BACKEND */}
              {error && mostrarError && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-danger-light p-4 text-red-800"
                >
                  <AlertCircle size={20} className="shrink-0" />

                  <div className="flex-1">
                    <p className="text-sm font-bold">
                      No fue posible iniciar sesión
                    </p>

                    <p className="mt-1 text-xs">{error}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      limpiarError();
                      setMostrarError(false);
                    }}
                    aria-label="Cerrar mensaje de error"
                    className="rounded p-1 hover:bg-red-100"
                  >
                    <X size={17} />
                  </button>
                </div>
              )}

              {/* FORMULARIO */}
              <form
                onSubmit={handleSubmit(manejarLogin)}
                className="flex flex-col gap-5"
                noValidate
              >
                {/* EMAIL */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="text-sm font-semibold">
                      Correo electrónico
                    </label>

                    <span className="text-[11px] text-ink-secondary">
                      Requerido
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-3.5 text-ink-secondary"
                    />

                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="admin@apexcommerce.com"
                      aria-invalid={!!errors.email}
                      {...register("email", {
                        required: "El correo es obligatorio.",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Ingresa un correo válido.",
                        },
                      })}
                      className="
                        h-11 w-full rounded-lg border
                        border-border-ui bg-surface-muted
                        pl-11 pr-4 text-sm text-ink
                        outline-none transition-colors
                        placeholder:text-ink-muted
                        focus:border-primary focus:bg-white
                      "
                    />
                  </div>

                  {errors.email && (
                    <p className="text-xs text-danger">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="password" className="text-sm font-semibold">
                    Contraseña
                  </label>

                  <div className="relative flex items-center">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-3.5 text-ink-secondary"
                    />

                    <input
                      id="password"
                      type={"password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      aria-invalid={!!errors.password}
                      {...register("password", {
                        required: "La contraseña es obligatoria.",
                      })}
                      className="
                        h-11 w-full rounded-lg border
                        border-border-ui bg-surface-muted
                        pl-11 pr-11 text-sm text-ink
                        outline-none transition-colors
                        placeholder:text-ink-muted
                        focus:border-primary focus:bg-white
                      "
                    />
                  </div>

                  {errors.password && (
                    <p className="text-xs text-danger">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={cargando}
                  className="
                    mt-1 flex h-12 w-full items-center
                    justify-center gap-2 rounded-lg
                    border border-primary-dark
                    bg-primary text-sm font-bold text-white
                    transition-all hover:bg-primary-hover
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {cargando ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      Iniciar sesión
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>

              {/* REGISTRO */}
              <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-lg bg-surface-muted p-4 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                    <UserPlus size={20} />
                  </div>

                  <div>
                    <p className="text-xs font-bold">¿No tienes una cuenta?</p>

                    <p className="mt-0.5 text-xs text-ink-secondary">
                      Regístrate.
                    </p>
                  </div>
                </div>

                <Link
                  to="/registro"
                  className="
                    flex w-full items-center justify-center
                    gap-1.5 rounded-lg border border-border-ui
                    bg-white px-4 py-2 text-xs font-bold
                    transition-colors hover:bg-slate-50
                    sm:w-auto
                  "
                >
                  Crear cuenta cliente
                  <ChevronRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border-ui bg-surface-muted py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-center sm:flex-row">
          <p className="text-xs text-ink-secondary">
            © 2026 Apex Commerce Platform
          </p>

          <span className="flex items-center gap-1.5 text-xs text-ink-secondary">
            <LockKeyhole size={14} className="text-success" />
            Acceso autenticado mediante JWT
          </span>
        </div>
      </footer>
    </div>
  );
}
