import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Package,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

import { useCarritoWebStore } from "../store/useCarritoWebStore";
import { tiendaService } from "../services/tienda";

const moneda = (valor: number | string) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

export default function CarritoPage() {
  const navigate = useNavigate();

  const productos = useCarritoWebStore((state) => state.productos);

  const agregarProducto = useCarritoWebStore((state) => state.agregarProducto);

  const disminuirCantidad = useCarritoWebStore(
    (state) => state.disminuirCantidad,
  );

  const eliminarProducto = useCarritoWebStore(
    (state) => state.eliminarProducto,
  );

  const vaciarCarrito = useCarritoWebStore((state) => state.vaciarCarrito);

  const [actualizando, setActualizando] = useState(true);
  const [errorStock, setErrorStock] = useState<string | null>(null);

  // Sincroniza los productos del carrito con el catálogo.
  useEffect(() => {
    let activo = true;

    const verificarProductos = async () => {
      setActualizando(true);
      setErrorStock(null);

      try {
        const catalogo = await tiendaService.obtenerProductos();

        if (!activo) return;

        const carritoActual = useCarritoWebStore.getState().productos;

        const catalogoPorId = new Map(
          catalogo.map((producto) => [producto.id, producto]),
        );

        const productosActualizados = carritoActual.flatMap((item) => {
          const articulo = catalogoPorId.get(item.id);

          if (!articulo || articulo.stock <= 0) {
            return [];
          }

          return [
            {
              ...item,
              nombre: articulo.nombre,
              precioVenta: articulo.precioVenta,
              stock: articulo.stock,
              cantidad: Math.min(item.cantidad, articulo.stock),
            },
          ];
        });

        // Actualizamos el carrito con información reciente.
        useCarritoWebStore.setState({
          productos: productosActualizados,
        });
      } catch {
        if (activo) {
          setErrorStock(
            "No pudimos verificar los precios y existencias actuales.",
          );
        }
      } finally {
        if (activo) setActualizando(false);
      }
    };

    void verificarProductos();

    return () => {
      activo = false;
    };
  }, []);

  const cantidadTotal = useMemo(
    () => productos.reduce((total, item) => total + item.cantidad, 0),
    [productos],
  );

  const subtotal = useMemo(
    () =>
      productos.reduce(
        (total, item) => total + Number(item.precioVenta) * item.cantidad,
        0,
      ),
    [productos],
  );

  const aumentarCantidad = (id: number) => {
    const producto = productos.find((item) => item.id === id);

    if (!producto || producto.cantidad >= producto.stock) {
      toast.error("No hay más unidades disponibles");
      return;
    }

    agregarProducto({
      id: producto.id,
      nombre: producto.nombre,
      precioVenta: producto.precioVenta,
      stock: producto.stock,
    });
  };

  const confirmarVaciar = () => {
    if (window.confirm("¿Quieres eliminar todos los artículos del carrito?")) {
      vaciarCarrito();
      toast.success("Carrito vaciado");
    }
  };

  const continuarCheckout = () => {
    if (actualizando || errorStock || productos.length === 0) {
      return;
    }

    navigate("/tienda/checkout");
  };

  if (!actualizando && productos.length === 0 && !errorStock) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <div className="rounded-full bg-[#fff1f2] p-7">
          <ShoppingCart size={54} className="text-[#991b1b]" />
        </div>

        <h1 className="text-3xl font-bold text-[#131b2e]">
          Tu carrito está vacío
        </h1>

        <p className="max-w-md text-[#897b78]">
          Todavía no has agregado productos. Explora el catálogo para encontrar
          algo que te guste.
        </p>

        <Link
          to="/tienda/productos"
          className="rounded-lg bg-[#991b1b] px-6 py-3 font-semibold text-white hover:bg-[#760009]"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 px-4 py-8 md:px-6">
      <header>
        <Link
          to="/tienda/productos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#991b1b] hover:underline"
        >
          <ArrowLeft size={16} />
          Seguir comprando
        </Link>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#131b2e]">Mi carrito</h1>

            <p className="mt-2 text-sm text-[#897b78]">
              {cantidadTotal} artículos seleccionados
            </p>
          </div>

          {productos.length > 0 && (
            <button
              type="button"
              onClick={confirmarVaciar}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-800"
            >
              <Trash2 size={17} />
              Vaciar carrito
            </button>
          )}
        </div>
      </header>

      {actualizando && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <RefreshCw size={18} className="animate-spin" />
          Verificando precios y disponibilidad...
        </div>
      )}

      {errorStock && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          <AlertTriangle size={20} />
          <span>{errorStock}</span>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        {/* Productos */}
        <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
          <div className="border-b border-[#ebe7e6] p-5">
            <h2 className="font-bold text-[#131b2e]">
              Productos seleccionados
            </h2>
          </div>

          <div className="divide-y divide-[#ebe7e6]">
            {productos.map((producto) => (
              <article
                key={producto.id}
                className="flex flex-col gap-4 p-5 sm:flex-row"
              >
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl bg-[#f5f1f3]">
                  <Package
                    size={43}
                    strokeWidth={1}
                    className="text-[#b6a8ac]"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-[#131b2e]">
                        {producto.nombre}
                      </h3>

                      <p className="mt-1 text-sm text-[#897b78]">
                        {moneda(producto.precioVenta)} por unidad
                      </p>

                      <p className="mt-1 text-xs text-[#897b78]">
                        {producto.stock} disponibles
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => eliminarProducto(producto.id)}
                      aria-label={`Eliminar ${producto.nombre}`}
                      className="self-start rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center overflow-hidden rounded-lg border border-[#ebe7e6]">
                      <button
                        type="button"
                        onClick={() => disminuirCantidad(producto.id)}
                        disabled={actualizando}
                        aria-label={`Disminuir cantidad de ${producto.nombre}`}
                        className="p-3 hover:bg-[#faf8ff] disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-bold">
                        {producto.cantidad}
                      </span>

                      <button
                        type="button"
                        onClick={() => aumentarCantidad(producto.id)}
                        disabled={
                          actualizando || producto.cantidad >= producto.stock
                        }
                        aria-label={`Aumentar cantidad de ${producto.nombre}`}
                        className="p-3 hover:bg-[#faf8ff] disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="text-lg font-bold text-[#991b1b]">
                      {moneda(Number(producto.precioVenta) * producto.cantidad)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Resumen */}
        <aside className="rounded-xl border border-[#ebe7e6] bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-[#131b2e]">
            Resumen del pedido
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#897b78]">
                Productos ({cantidadTotal})
              </span>

              <span className="font-semibold">{moneda(subtotal)}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-[#897b78]">Envío</span>

              <span className="text-[#897b78]">Por definir</span>
            </div>

            <div className="border-t border-[#ebe7e6] pt-4">
              <div className="flex items-center justify-between">
                <span className="font-bold">Total de productos</span>

                <span className="text-2xl font-bold text-[#991b1b]">
                  {moneda(subtotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={continuarCheckout}
              disabled={actualizando || !!errorStock || productos.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Continuar al checkout
              <ArrowRight size={18} />
            </button>

            <p className="text-center text-xs text-[#897b78]">
              Los precios y existencias se validarán nuevamente al confirmar el
              pedido.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
