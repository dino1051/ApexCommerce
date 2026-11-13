import { ShoppingCart, Package } from "lucide-react";
import toast from "react-hot-toast";

import type { ProductoTienda } from "../../types/tienda";
import { useCarritoWebStore } from "../../store/useCarritoWebStore";
import { Link } from "react-router-dom";

interface Props {
  producto: ProductoTienda;
}

const moneda = (valor: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

export default function TarjetaProducto({ producto }: Props) {
  const agregarProducto = useCarritoWebStore((state) => state.agregarProducto);

  const productosCarrito = useCarritoWebStore((state) => state.productos);

  const cantidadCarrito =
    productosCarrito.find((item) => item.id === producto.id)?.cantidad ?? 0;

  const agotado = producto.stock <= 0;
  const limiteAlcanzado = cantidadCarrito >= producto.stock;

  const agregar = () => {
    if (agotado || limiteAlcanzado) return;

    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
    });

    toast.success("Producto agregado al carrito");
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#ebe7e6] bg-white transition-shadow hover:shadow-md">
      <Link
        to={`/tienda/productos/${producto.id}`}
        className="relative flex aspect-square items-center justify-center bg-[#f5f1f3] transition-colors hover:bg-[#eee5e9]"
        aria-label={`Ver detalle de ${producto.nombre}`}
      >
        <Package size={65} strokeWidth={1} className="text-[#b6a8ac]" />

        {agotado && (
          <span className="absolute left-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#991b1b]">
          {producto.categoria?.nombre ?? "Producto"}
        </p>

        <Link to={`/tienda/productos/${producto.id}`}>
          <h3 className="line-clamp-2 font-bold text-[#131b2e] hover:text-[#991b1b]">
            {producto.nombre}
          </h3>
        </Link>

        {producto.descripcion && (
          <p className="mt-2 line-clamp-2 text-sm text-[#897b78]">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-auto pt-4">
          <p className="text-xl font-bold text-[#991b1b]">
            {moneda(producto.precioVenta)}
          </p>

          <p className="mt-1 text-xs text-[#897b78]">
            {agotado ? "Sin existencias" : `${producto.stock} disponibles`}
          </p>

          <button
            type="button"
            onClick={agregar}
            disabled={agotado || limiteAlcanzado}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#760009] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart size={17} />

            {agotado
              ? "Agotado"
              : limiteAlcanzado
                ? "Límite alcanzado"
                : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </article>
  );
}
