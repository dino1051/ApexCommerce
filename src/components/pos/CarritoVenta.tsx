import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  ShoppingBasket,
} from "lucide-react";

import { usePosStore } from "../../store/usePosStore";

interface CarritoVentaProps {
  onCobrar: () => void;
  deshabilitado?: boolean;
}

export function CarritoVenta({
  onCobrar,
  deshabilitado = false,
}: CarritoVentaProps) {
  const carrito = usePosStore((state) => state.carrito);

  const aumentarCantidad = usePosStore((state) => state.aumentarCantidad);

  const disminuirCantidad = usePosStore((state) => state.disminuirCantidad);

  const eliminarArticulo = usePosStore((state) => state.eliminarArticulo);

  const vaciarCarrito = usePosStore((state) => state.vaciarCarrito);

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado + Number(item.articulo.precioVenta) * item.cantidad,
    0,
  );

  const cantidadTotal = carrito.reduce(
    (acumulado, item) => acumulado + item.cantidad,
    0,
  );

  const formatoMoneda = (valor: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(valor);

  return (
    <section className="rounded-xl border border-[#ebe7e6] bg-white">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
        <div className="flex items-center gap-2">
          <ShoppingCart size={22} className="text-[#991b1b]" />

          <h2 className="text-lg font-bold text-[#131b2e]">Carrito de venta</h2>
        </div>

        <span className="rounded-full bg-[#fff1f2] px-3 py-1 text-xs font-semibold text-[#991b1b]">
          {cantidadTotal} artículos
        </span>
      </div>

      {/* Contenido del carrito */}
      <div className="max-h-[450px] min-h-[200px] overflow-y-auto p-5">
        {carrito.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <ShoppingBasket size={40} className="mb-3 text-[#c9bfbd]" />

            <p className="font-semibold text-[#131b2e]">
              Tu carrito está vacío
            </p>

            <p className="mt-1 text-sm text-[#897b78]">
              Selecciona artículos del catálogo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {carrito.map((item) => {
              const subtotal =
                Number(item.articulo.precioVenta) * item.cantidad;

              return (
                <div
                  key={item.articulo.id}
                  className="border-b border-[#f0eceb] pb-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-semibold text-[#131b2e]">
                        {item.articulo.nombre}
                      </h3>

                      <p className="mt-1 text-xs text-[#897b78]">
                        {formatoMoneda(Number(item.articulo.precioVenta))} c/u
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarArticulo(item.articulo.id)}
                      disabled={deshabilitado}
                      className="rounded-lg p-1.5 text-[#a09896] transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Eliminar ${item.articulo.nombre}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center rounded-lg border border-[#ebe7e6]">
                      <button
                        type="button"
                        onClick={() => disminuirCantidad(item.articulo.id)}
                        disabled={deshabilitado}
                        className="p-2 text-[#59413e] hover:bg-[#f7f5fa] disabled:opacity-50"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-9 text-center text-sm font-semibold">
                        {item.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => aumentarCantidad(item.articulo.id)}
                        disabled={
                          deshabilitado || item.cantidad >= item.articulo.stock
                        }
                        className="p-2 text-[#59413e] hover:bg-[#f7f5fa] disabled:opacity-50"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <span className="text-sm font-bold text-[#131b2e]">
                      {formatoMoneda(subtotal)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="border-t border-[#ebe7e6] p-5">
        <div className="mb-2 flex items-center justify-between text-sm text-[#766b69]">
          <span>Productos</span>
          <span>{cantidadTotal}</span>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <span className="font-semibold text-[#131b2e]">Total</span>

          <span className="text-2xl font-bold text-[#991b1b]">
            {formatoMoneda(total)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCobrar}
          disabled={carrito.length === 0 || deshabilitado}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#760009] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          <CreditCard size={19} />
          Cobrar {formatoMoneda(total)}
        </button>

        {carrito.length > 0 && (
          <button
            type="button"
            onClick={vaciarCarrito}
            disabled={deshabilitado}
            className="mt-3 w-full rounded-lg px-4 py-2 text-sm font-medium text-[#897b78] hover:bg-[#f7f5fa] hover:text-red-600 disabled:opacity-50"
          >
            Vaciar carrito
          </button>
        )}
      </div>
    </section>
  );
}
