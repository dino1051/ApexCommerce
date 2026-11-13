import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShoppingBag,
  ShoppingCart,
  PackageCheck,
  ShieldCheck,
  RefreshCw,
  PackageSearch,
} from "lucide-react";

import { useTiendaStore } from "../../store/useTiendaStore";
import TarjetaProducto from "../../components/tienda/TarjetaProducto";

export default function TiendaInicioPage() {
  const productos = useTiendaStore((state) => state.productos);

  const cargando = useTiendaStore((state) => state.cargando);

  const error = useTiendaStore((state) => state.error);

  const cargarProductos = useTiendaStore((state) => state.cargarProductos);

  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  const destacados = useMemo(
    () => productos.filter((producto) => producto.stock > 0).slice(0, 4),
    [productos],
  );

  const beneficios = [
    {
      titulo: "Catálogo actualizado",
      descripcion: "Consulta nuestros productos y sus existencias.",
      icono: PackageCheck,
    },
    {
      titulo: "Compra sencilla",
      descripcion: "Agrega productos a tu carrito en segundos.",
      icono: ShoppingCart,
    },
    {
      titulo: "Consulta tus pedidos",
      descripcion: "Revisa tus compras desde tu cuenta.",
      icono: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-14 px-4 py-8 md:px-6">
      {/* Banner principal */}
      <section className="relative overflow-hidden rounded-3xl bg-[#991b1b] px-7 py-14 text-white md:px-14 md:py-20">
        <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 right-16 h-72 w-72 rounded-full bg-white/10" />

        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag size={15} />
            Bienvenido a Apex Commerce
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Tu próxima compra comienza aquí.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-red-100">
            Explora nuestra selección de productos, encuentra lo que necesitas y
            prepara tu próxima compra desde cualquier dispositivo.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/tienda/productos"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-[#991b1b] transition-colors hover:bg-red-50"
            >
              Explorar productos
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/tienda/carrito"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <ShoppingCart size={19} />
              Ver carrito
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="grid gap-4 md:grid-cols-3">
        {beneficios.map((beneficio) => {
          const Icono = beneficio.icono;

          return (
            <div
              key={beneficio.titulo}
              className="flex items-start gap-4 rounded-2xl border border-[#ebe7e6] bg-white p-6"
            >
              <div className="rounded-xl bg-[#fff1f2] p-3 text-[#991b1b]">
                <Icono size={25} />
              </div>

              <div>
                <h2 className="font-bold text-[#131b2e]">{beneficio.titulo}</h2>

                <p className="mt-2 text-sm leading-relaxed text-[#897b78]">
                  {beneficio.descripcion}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Productos destacados */}
      <section className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
              Descubre nuestra selección
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#131b2e]">
              Productos destacados
            </h2>

            <p className="mt-2 text-sm text-[#897b78]">
              Algunos artículos disponibles en nuestra tienda.
            </p>
          </div>

          <Link
            to="/tienda/productos"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#991b1b] hover:underline"
          >
            Ver catálogo completo
            <ArrowRight size={17} />
          </Link>
        </div>

        {cargando && productos.length === 0 ? (
          <div className="flex items-center justify-center gap-3 py-16 text-[#897b78]">
            <RefreshCw size={21} className="animate-spin" />
            Cargando productos...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6"
          >
            <p className="text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => void cargarProductos()}
              className="mt-3 text-sm font-bold text-[#991b1b] hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : destacados.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#ebe7e6] bg-white py-14">
            <PackageSearch size={45} className="text-[#b6a8ac]" />

            <p className="font-semibold text-[#131b2e]">
              No hay productos disponibles por ahora.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((producto) => (
              <TarjetaProducto key={producto.id} producto={producto} />
            ))}
          </div>
        )}
      </section>

      {/* Sección final */}
      <section className="rounded-3xl bg-[#f5e8ec] px-7 py-12 text-center md:px-12">
        <h2 className="text-2xl font-bold text-[#131b2e] md:text-3xl">
          ¿Buscas algo en particular?
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#766b69]">
          Explora todos nuestros artículos y utiliza los filtros para encontrar
          lo que necesitas.
        </p>

        <Link
          to="/tienda/productos"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#991b1b] px-6 py-3 font-bold text-white hover:bg-[#760009]"
        >
          Ir al catálogo
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
