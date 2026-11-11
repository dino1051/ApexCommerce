import { useMemo, useState } from "react";
import { Package, Plus, Search } from "lucide-react";

import { usePosStore } from "../../store/usePosStore";
import type { ArticuloPos } from "../../types/pos";

interface CatalogoArticulosProps {
  articulos: ArticuloPos[];
}

export function CatalogoArticulos({ articulos }: CatalogoArticulosProps) {
  const [busqueda, setBusqueda] = useState("");

  const agregarArticulo = usePosStore((state) => state.agregarArticulo);

  const carrito = usePosStore((state) => state.carrito);

  const articulosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return articulos.filter((articulo) =>
      articulo.nombre.toLowerCase().includes(texto),
    );
  }, [articulos, busqueda]);

  const formatoMoneda = (valor: string | number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(valor));

  return (
    <section className="rounded-xl border border-[#ebe7e6] bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-[#131b2e]">
          Catálogo de artículos
        </h2>

        <p className="mt-1 text-sm text-[#766b69]">
          Selecciona los productos para agregarlos a la venta.
        </p>
      </div>

      <div className="relative mb-5">
        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
        />

        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar artículo..."
          className="w-full rounded-lg border border-[#e5e1e0] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#991b1b]"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {articulosFiltrados.map((articulo) => {
          const cantidadEnCarrito =
            carrito.find((item) => item.articulo.id === articulo.id)
              ?.cantidad ?? 0;

          const sinDisponibilidad = articulo.stock <= cantidadEnCarrito;

          return (
            <article
              key={articulo.id}
              className="flex flex-col justify-between rounded-xl border border-[#ebe7e6] p-4 transition-colors hover:border-[#d7b6b6]"
            >
              <div>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#fff1f2] text-[#991b1b]">
                  <Package size={24} />
                </div>

                <p className="text-xs text-[#897b78]">
                  {articulo.categoria.nombre}
                </p>

                <h3 className="mt-1 font-semibold text-[#131b2e]">
                  {articulo.nombre}
                </h3>

                <p className="mt-2 text-lg font-bold text-[#991b1b]">
                  {formatoMoneda(articulo.precioVenta)}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2">
                <span
                  className={`text-xs font-medium ${
                    articulo.stock === 0
                      ? "text-red-600"
                      : articulo.stock <= 5
                        ? "text-amber-600"
                        : "text-green-700"
                  }`}
                >
                  Stock: {articulo.stock}
                </span>

                <button
                  type="button"
                  onClick={() => agregarArticulo(articulo)}
                  disabled={sinDisponibilidad}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#991b1b] px-3 py-2 text-xs font-semibold text-white hover:bg-[#760009] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Plus size={15} />
                  Agregar
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {articulosFiltrados.length === 0 && (
        <p className="py-12 text-center text-sm text-[#897b78]">
          No se encontraron artículos.
        </p>
      )}
    </section>
  );
}
