import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Package,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { tiendaService } from "../../services/tienda";
import { useCarritoWebStore } from "../../store/useCarritoWebStore";
import type { ProductoTienda } from "../../types/tienda";

const moneda = (valor: number | string) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();

  const [producto, setProducto] = useState<ProductoTienda | null>(null);

  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const agregarProducto = useCarritoWebStore((state) => state.agregarProducto);

  const productosCarrito = useCarritoWebStore((state) => state.productos);

  const idNumerico = Number(id);
  const idValido = Number.isInteger(idNumerico) && idNumerico > 0;

  useEffect(() => {
    if (!idValido) {
      setProducto(null);
      setError("El identificador del producto no es válido.");
      setCargando(false);
      return;
    }

    let activo = true;

    const cargarProducto = async () => {
      setCargando(true);
      setError(null);
      setProducto(null);
      setCantidad(1);

      try {
        const datos = await tiendaService.obtenerProductoPorId(idNumerico);

        if (activo) {
          setProducto(datos);
        }
      } catch {
        if (activo) {
          setError("No fue posible encontrar o cargar este producto.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargarProducto();

    return () => {
      activo = false;
    };
  }, [idNumerico, idValido, version]);

  const cantidadEnCarrito = producto
    ? (productosCarrito.find((item) => item.id === producto.id)?.cantidad ?? 0)
    : 0;

  const stock = producto?.stock ?? 0;

  const disponiblesParaAgregar = Math.max(0, stock - cantidadEnCarrito);

  const agotado = stock <= 0;
  const limiteAlcanzado = disponiblesParaAgregar === 0;

  const aumentar = () => {
    setCantidad((actual) => Math.min(actual + 1, disponiblesParaAgregar));
  };

  const disminuir = () => {
    setCantidad((actual) => Math.max(1, actual - 1));
  };

  const agregarAlCarrito = () => {
    if (
      !producto ||
      agotado ||
      limiteAlcanzado ||
      cantidad < 1 ||
      cantidad > disponiblesParaAgregar
    ) {
      toast.error("No hay suficientes unidades disponibles");
      return;
    }

    for (let i = 0; i < cantidad; i++) {
      agregarProducto({
        id: producto.id,
        nombre: producto.nombre,
        precioVenta: producto.precioVenta,
        stock: producto.stock,
      });
    }

    toast.success(
      cantidad === 1
        ? "Producto agregado al carrito"
        : `${cantidad} unidades agregadas al carrito`,
    );

    setCantidad(1);
  };

  if (cargando) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center gap-3 text-[#897b78]">
        <RefreshCw size={24} className="animate-spin" />
        Cargando producto...
      </div>
    );
  }

  if (error || !producto) {
    return (
      <div className="flex min-h-[65vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <XCircle size={55} className="text-[#991b1b]" />

        <h1 className="text-2xl font-bold text-[#131b2e]">
          Producto no disponible
        </h1>

        <p className="max-w-md text-[#897b78]">
          {error ?? "No encontramos este artículo."}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {idValido && (
            <button
              type="button"
              onClick={() => setVersion((actual) => actual + 1)}
              className="rounded-lg border border-[#991b1b] px-5 py-3 font-semibold text-[#991b1b]"
            >
              Reintentar
            </button>
          )}

          <Link
            to="/tienda/productos"
            className="rounded-lg bg-[#991b1b] px-5 py-3 font-semibold text-white"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-6">
      <Link
        to="/tienda/productos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#991b1b] hover:underline"
      >
        <ArrowLeft size={17} />
        Volver al catálogo
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen del producto */}
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-[#ebe7e6] bg-[#f5f1f3]">
          <Package size={120} strokeWidth={0.8} className="text-[#b6a8ac]" />
        </div>

        {/* Información */}
        <section className="flex flex-col">
          <p className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
            {producto.categoria?.nombre ?? "Producto"}
          </p>

          <h1 className="mt-3 text-3xl font-extrabold text-[#131b2e] md:text-4xl">
            {producto.nombre}
          </h1>

          <p className="mt-6 text-4xl font-bold text-[#991b1b]">
            {moneda(producto.precioVenta)}
          </p>

          <div className="mt-5">
            {agotado ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                <XCircle size={17} />
                Producto agotado
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                <CheckCircle2 size={17} />
                {stock} unidades disponibles
              </span>
            )}
          </div>

          <div className="mt-7 border-t border-[#ebe7e6] pt-6">
            <h2 className="font-bold text-[#131b2e]">Descripción</h2>

            <p className="mt-3 leading-relaxed text-[#766b69]">
              {producto.descripcion?.trim() ||
                "Este producto forma parte de nuestro catálogo. Consulta su precio y disponibilidad antes de agregarlo al carrito."}
            </p>
          </div>

          <div className="mt-8 border-t border-[#ebe7e6] pt-6">
            <p className="mb-3 text-sm font-bold text-[#131b2e]">Cantidad</p>

            <div className="flex w-fit items-center overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
              <button
                type="button"
                onClick={disminuir}
                disabled={cantidad <= 1 || limiteAlcanzado}
                aria-label="Disminuir cantidad"
                className="p-4 hover:bg-[#faf8ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <span className="min-w-14 text-center font-bold">{cantidad}</span>

              <button
                type="button"
                onClick={aumentar}
                disabled={limiteAlcanzado || cantidad >= disponiblesParaAgregar}
                aria-label="Aumentar cantidad"
                className="p-4 hover:bg-[#faf8ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={18} />
              </button>
            </div>

            {cantidadEnCarrito > 0 && (
              <p className="mt-3 text-xs text-[#897b78]">
                Ya tienes {cantidadEnCarrito} unidades de este producto en tu
                carrito.
              </p>
            )}
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={agregarAlCarrito}
              disabled={agotado || limiteAlcanzado}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#991b1b] px-5 py-4 font-bold text-white transition-colors hover:bg-[#760009] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart size={21} />

              {agotado
                ? "Producto agotado"
                : limiteAlcanzado
                  ? "Stock agregado al carrito"
                  : "Agregar al carrito"}
            </button>

            <Link
              to="/tienda/carrito"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#991b1b] px-5 py-4 font-semibold text-[#991b1b] hover:bg-[#fff1f2]"
            >
              Ver mi carrito
              <ArrowRight size={19} />
            </Link>
          </div>

          {!agotado && !limiteAlcanzado && (
            <p className="mt-4 text-center text-sm text-[#897b78]">
              Subtotal de la selección:{" "}
              <span className="font-bold text-[#131b2e]">
                {moneda(Number(producto.precioVenta) * cantidad)}
              </span>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
