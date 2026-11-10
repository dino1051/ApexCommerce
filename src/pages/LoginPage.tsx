import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type TipoRuta = "admin" | "cashier" | "customer" | null;

export default function LoginPage() {
  const navigate = useNavigate();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [recordarSesion, setRecordarSesion] = useState(false);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const detectarRuta = (): TipoRuta => {
    const valor = identity.toLowerCase().trim();

    if (!valor) return null;

    if (valor.includes("admin")) {
      return "admin";
    }

    if (
      valor.includes("cajer") ||
      valor.includes("pos") ||
      valor.includes("terminal")
    ) {
      return "cashier";
    }

    if (valor.includes("@")) {
      return "customer";
    }

    return null;
  };

  const rutaDetectada = detectarRuta();

  const getRutaTexto = () => {
    switch (rutaDetectada) {
      case "admin":
        return "Detectado: Redirigiendo a /admin/dashboard";

      case "cashier":
        return "Detectado: Redirigiendo a /cajero/pos";

      case "customer":
        return "Detectado: Redirigiendo a /tienda";

      default:
        return "Esperando credencial";
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setMensaje(null);

    if (!identity.trim() || !password) {
      setError("Por favor ingresa tanto tu correo/usuario como tu contraseña.");
      return;
    }

    try {
      setCargando(true);

      /*
       * Aquí posteriormente conectaremos:
       *
       * const respuesta = await authService.login({
       *   identity,
       *   password,
       * });
       *
       * useAuthStore.getState().iniciarSesion(...)
       *
       * El rol recibido por la API será el que determine
       * la redirección real.
       */

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const ruta = detectarRuta();

      setMensaje("Sesión validada con éxito.");

      setTimeout(() => {
        if (ruta === "admin") {
          navigate("/admin/dashboard");
        } else if (ruta === "cashier") {
          navigate("/cajero/pos");
        } else {
          navigate("/tienda");
        }
      }, 500);
    } catch {
      setError("Credenciales no reconocidas o cuenta temporalmente bloqueada.");
    } finally {
      setCargando(false);
    }
  };

  const handleForgotPassword = () => {
    setError(null);
    setMensaje(
      identity.trim()
        ? `Si existe una cuenta asociada a ${identity.trim()}, recibirás instrucciones para restablecer tu contraseña.`
        : "Ingresa primero tu correo o usuario para solicitar la recuperación.",
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {/* HEADER */}
      <header className="w-full bg-white/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] fixed top-0 left-0 right-0 z-50">
        <div className="h-16 max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link
            to="/tienda"
            className="flex items-center gap-1 text-[#59413e] hover:text-[#131b2e] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>

            <span className="text-sm font-semibold">Tienda Pública</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#991b1b] flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">
                token
              </span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight">APEX</span>

              <span className="text-xs text-[#760009] font-bold tracking-wider uppercase">
                Commerce
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setMensaje(
                  "Para recibir ayuda con el acceso, contacta al soporte.",
                );
                setError(null);
              }}
              className="flex items-center gap-1 text-[#59413e] hover:text-[#131b2e] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                help_outline
              </span>

              <span className="hidden sm:inline text-xs font-semibold">
                Soporte y Ayuda
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="w-full pt-16 flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col w-full max-w-6xl mx-auto">
          {/* META */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#991b1b] text-white text-[11px] font-semibold uppercase tracking-wider shadow-sm">
                <span className="material-symbols-outlined text-[14px]">
                  verified_user
                </span>
                Acceso Unificado
              </span>

              <span className="hidden sm:inline-flex items-center gap-1 text-[#59413e] text-[11px]">
                <span className="w-2 h-2 rounded-full bg-[#005b27]" />
                Nodo Autenticación Activo
              </span>
            </div>

            <span className="text-[11px] text-[#59413e] flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-[#005b27]">
                shield
              </span>
              TLS Seguro
            </span>
          </div>

          {/* GRID PRINCIPAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* FORMULARIO */}
            <div className="lg:col-span-7 bg-white rounded-xl shadow-xl p-6 sm:p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#991b1b]" />

              <div className="mb-6 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-[#760009] uppercase font-bold tracking-widest">
                    Acceso al sistema
                  </span>

                  <span className="text-[#59413e] opacity-40">•</span>

                  <span className="text-[11px] text-[#59413e]">
                    Acceso por rol
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight">
                  Iniciar Sesión
                </h1>

                <p className="text-sm text-[#59413e] mt-1">
                  Ingresa tus credenciales para acceder al portal
                  correspondiente a tu rol.
                </p>
              </div>

              {/* RUTAS */}
              <div className="bg-[#f2f3ff] rounded-lg p-3 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#760009]">
                      route
                    </span>
                    Enrutamiento por rol
                  </span>

                  <span className="text-[11px] text-[#760009] font-semibold">
                    {getRutaTexto()}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-center">
                  <RutaBadge
                    activa={rutaDetectada === "admin"}
                    icono="admin_panel_settings"
                    nombre="Admin"
                    ruta="/admin/dashboard"
                  />

                  <RutaBadge
                    activa={rutaDetectada === "cashier"}
                    icono="point_of_sale"
                    nombre="Cajero"
                    ruta="/cajero/pos"
                  />

                  <RutaBadge
                    activa={rutaDetectada === "customer"}
                    icono="storefront"
                    nombre="Cliente"
                    ruta="/tienda"
                  />
                </div>
              </div>

              {/* MENSAJES */}
              {error && (
                <div className="mb-4 p-4 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    error
                  </span>

                  <div className="flex-1">
                    <p className="text-sm font-bold">Validación requerida</p>

                    <p className="text-xs mt-0.5">{error}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="hover:opacity-70"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>
              )}

              {mensaje && (
                <div className="mb-4 p-4 rounded-lg bg-[#95f8a7] text-[#005323] flex items-start gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    check_circle
                  </span>

                  <div className="flex-1">
                    <p className="text-sm font-bold">Sesión validada</p>

                    <p className="text-xs mt-0.5">{mensaje}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMensaje(null)}
                    className="hover:opacity-70"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      close
                    </span>
                  </button>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* USUARIO */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="identity"
                      className="text-sm font-semibold flex items-center gap-1.5"
                    >
                      Correo electrónico o Usuario
                    </label>

                    <span className="text-[11px] text-[#59413e]">
                      {identity ? "Detectado" : "Requerido"}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#59413e] pointer-events-none text-[20px]">
                      alternate_email
                    </span>

                    <input
                      id="identity"
                      name="identity"
                      type="text"
                      autoComplete="username"
                      value={identity}
                      onChange={(e) => {
                        setIdentity(e.target.value);
                        setError(null);
                      }}
                      placeholder="ej. admin@apexcommerce.com"
                      required
                      className="w-full h-11 pl-11 pr-4 bg-[#f2f3ff] rounded-lg text-sm outline-none transition-all focus:bg-white focus:shadow-md placeholder:text-[#59413e]/50"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-sm font-semibold">
                      Contraseña
                    </label>

                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-[#760009] hover:underline font-semibold"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3.5 text-[#59413e] pointer-events-none text-[20px]">
                      lock
                    </span>

                    <input
                      id="password"
                      name="password"
                      type={mostrarPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      placeholder="••••••••"
                      required
                      className="w-full h-11 pl-11 pr-11 bg-[#f2f3ff] rounded-lg text-sm outline-none transition-all focus:bg-white focus:shadow-md placeholder:text-[#59413e]/50"
                    />

                    <button
                      type="button"
                      aria-label={
                        mostrarPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      onClick={() => setMostrarPassword((actual) => !actual)}
                      className="absolute right-3.5 text-[#59413e] hover:text-[#131b2e] flex items-center justify-center p-1 rounded"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {mostrarPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* RECORDAR */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={recordarSesion}
                      onChange={(e) => setRecordarSesion(e.target.checked)}
                      className="w-4 h-4 accent-[#991b1b] cursor-pointer"
                    />

                    <span className="text-sm text-[#59413e]">
                      Recordar sesión
                    </span>
                  </label>

                  <span className="inline-flex items-center gap-1 text-[11px] text-[#59413e]">
                    <span className="material-symbols-outlined text-[14px] text-[#005b27]">
                      check_circle
                    </span>
                    Equipo confiable
                  </span>
                </div>

                {/* BOTÓN */}
                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full h-12 mt-2 bg-[#991b1b] hover:bg-[#760009] disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {cargando ? (
                    <>
                      <span className="animate-spin h-5 w-5 rounded-full border-2 border-white border-t-transparent" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* REGISTRO */}
              <div className="mt-6 pt-4 bg-[#f2f3ff] rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-center sm:text-left">
                  <div className="w-9 h-9 rounded-full bg-[#d5e0f8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">
                      person_add
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold">¿No tienes una cuenta?</p>

                    <p className="text-xs text-[#59413e]">
                      Regístrate como Cliente Web.
                    </p>
                  </div>
                </div>

                <Link
                  to="/registro"
                  className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#eaedff] rounded-lg text-xs font-bold text-center shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  Crear Cuenta Cliente
                  <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                  </span>
                </Link>
              </div>
            </div>

            {/* PANEL DERECHO */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#f2f3ff] rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#991b1b] text-white flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">security</span>
                  </div>

                  <div>
                    <h2 className="font-bold">Acceso seguro por rol</h2>

                    <p className="text-sm text-[#59413e] mt-1">
                      Cada cuenta es dirigida automáticamente al espacio
                      correspondiente a sus permisos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-bold mb-4">Experiencias disponibles</h2>

                <div className="flex flex-col gap-3">
                  <RolInfo
                    icono="admin_panel_settings"
                    titulo="Administrador"
                    descripcion="Catálogo, usuarios, pedidos, caja y reportes."
                  />

                  <RolInfo
                    icono="point_of_sale"
                    titulo="Cajero"
                    descripcion="POS, ventas, pedidos e historial."
                  />

                  <RolInfo
                    icono="storefront"
                    titulo="Cliente Web"
                    descripcion="Catálogo, carrito, checkout y pedidos."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full py-4 bg-[#f2f3ff]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p className="text-xs text-[#59413e]">
            © 2026 Apex Commerce Platform. Entorno seguro.
          </p>

          <div className="flex items-center gap-4 text-[11px] text-[#59413e]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#005b27]">
                lock
              </span>
              Conexión segura
            </span>

            <span>Privacidad y Términos</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --------------------------------
   COMPONENTES AUXILIARES
--------------------------------- */

interface RutaBadgeProps {
  activa: boolean;
  icono: string;
  nombre: string;
  ruta: string;
}

function RutaBadge({ activa, icono, nombre, ruta }: RutaBadgeProps) {
  return (
    <div
      className={`py-1.5 px-2 rounded transition-all duration-200 ${
        activa ? "bg-[#991b1b] text-white shadow-sm" : "bg-white text-[#59413e]"
      }`}
    >
      <div className="font-bold flex items-center justify-center gap-1 text-xs">
        <span className="material-symbols-outlined text-[14px]">{icono}</span>

        {nombre}
      </div>

      <span className="text-[10px] block mt-0.5 opacity-80">{ruta}</span>
    </div>
  );
}

interface RolInfoProps {
  icono: string;
  titulo: string;
  descripcion: string;
}

function RolInfo({ icono, titulo, descripcion }: RolInfoProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-[#760009]">
          {icono}
        </span>
      </div>

      <div>
        <p className="text-sm font-semibold">{titulo}</p>

        <p className="text-xs text-[#59413e] mt-0.5">{descripcion}</p>
      </div>
    </div>
  );
}
