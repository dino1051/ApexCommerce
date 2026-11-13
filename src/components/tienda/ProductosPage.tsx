import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  PackageSearch,
} from "lucide-react";

import { useTiendaStore } from "../../store/useTiendaStore";
import TarjetaProducto from "../../components/tienda/TarjetaProducto";

type Orden = "recientes" | "precio-asc" | "precio-desc" | "nombre";

export default function ProductosPage() {
  const productos = useTiendaStore((state) => state.productos);
  const cargando = useTiendaStore((state) => state.cargando);
  const error = useTiendaStore((state) => state.error);
  const cargarProductos = useTiendaStore((state) => state.cargarProductos);

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("TODAS");
  const [orden, setOrden] = useState<Orden>("recientes");
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  const categorias = useMemo(() => {
    const mapa = new Map<number, string>();

    productos.forEach((producto) => {
      if (producto.categoria) {
        mapa.set(producto.id_categoria, producto.categoria.nombre);
      }
    });

    return Array.from(mapa, ([id, nombre]) => ({
      id,
      nombre,
    }));
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    const resultado = productos.filter((producto) => {
      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(texto) ||
        (producto.descripcion ?? "").toLowerCase().includes(texto);

      const coincideCategoria =
        categoria === "TODAS" || String(producto.id_categoria) === categoria;

      const coincideStock = !soloDisponibles || producto.stock > 0;

      return coincideBusqueda && coincideCategoria && coincideStock;
    });

    return resultado.sort((a, b) => {
      switch (orden) {
        case "precio-asc":
          return Number(a.precioVenta) - Number(b.precioVenta);

        case "precio-desc":
          return Number(b.precioVenta) - Number(a.precioVenta);

        case "nombre":
          return a.nombre.localeCompare(b.nombre, "es");

        default:
          // Conserva el orden recibido de la API.
          return 0;
      }
    });
  }, [productos, busqueda, categoria, orden, soloDisponibles]);

  return (
    <div className="space-y-7 px-4 py-8 md:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
            Nuestra tienda
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#131b2e]">
            Explorar productos
          </h1>

          <p className="mt-2 text-sm text-[#897b78]">
            Descubre los artículos disponibles en Apex Commerce.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarProductos()}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {/* Filtros */}
      <section className="rounded-xl border border-[#ebe7e6] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar artículos..."
              className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            aria-label="Filtrar por categoría"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODAS">Todas las categorías</option>

            {categorias.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.nombre}
              </option>
            ))}
          </select>

          <div className="relative">
            <SlidersHorizontal
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <select
              value={orden}
              onChange={(e) => setOrden(e.target.value as Orden)}
              aria-label="Ordenar productos"
              className="w-full appearance-none rounded-lg border border-[#ebe7e6] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            >
              <option value="recientes">Orden predeterminado</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
              <option value="nombre">Nombre A-Z</option>
            </select>
          </div>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-[#766b69]">
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
            className="accent-[#991b1b]"
          />
          Mostrar solo productos disponibles
        </label>
      </section>

      {/* Resultados */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#897b78]">
          {productosFiltrados.length} productos encontrados
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {cargando && productos.length === 0 ? (
        <div className="py-16 text-center text-[#897b78]">
          Cargando productos...
        </div>
      ) : !error && productosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#ebe7e6] bg-white py-16 text-center">
          <PackageSearch size={48} className="text-[#b6a8ac]" />

          <h2 className="font-bold text-[#131b2e]">No encontramos productos</h2>

          <p className="text-sm text-[#897b78]">
            Prueba con otra búsqueda o cambia los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <TarjetaProducto key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
}
