import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  LockKeyhole,
  Package,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useCarritoWebStore } from "../../store/useCarritoWebStore";
import { tiendaService } from "../../services/tienda";

interface DetallePedidoDTO {
  id_articulo: number;
  cantidadArticulos: number;
}

interface CrearPedidoDTO {
  detalles: DetallePedidoDTO[];
}

const moneda = (valor: number | string) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

export default function CheckoutPage() {
  const usuario = useAuthStore((state) => state.usuario);

  const productos = useCarritoWebStore((state) => state.productos);

  const [verificando, setVerificando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificado, setVerificado] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let activo = true;

    const verificarCarrito = async () => {
      setVerificando(true);
      setVerificado(false);
      setError(null);

      try {
        const catalogo = await tiendaService.obtenerProductos();

        if (!activo) return;

        const carritoActual = useCarritoWebStore.getState().productos;

        if (carritoActual.length === 0) {
          setError("Tu carrito está vacío.");
          return;
        }

        const articulosPorId = new Map(
          catalogo.map((articulo) => [articulo.id, articulo]),
        );

        const problemas: string[] = [];

        const actualizados = carritoActual.map((item) => {
          const articulo = articulosPorId.get(item.id);

          if (!articulo) {
            problemas.push(`${item.nombre} ya no está disponible.`);
            return item;
          }

          if (articulo.stock < item.cantidad) {
            problemas.push(
              `${articulo.nombre}: solo hay ${articulo.stock} unidades disponibles.`,
            );
          }

          return {
            ...item,
            nombre: articulo.nombre,
            precioVenta: articulo.precioVenta,
            stock: articulo.stock,
          };
        });

        useCarritoWebStore.setState({
          productos: actualizados,
        });

        if (problemas.length > 0) {
          setError(problemas.join(" "));
          return;
        }

        setVerificado(true);
      } catch {
        if (activo) {
          setError("No fue posible verificar los precios y existencias.");
        }
      } finally {
        if (activo) setVerificando(false);
      }
    };

    void verificarCarrito();

    return () => {
      activo = false;
    };
  }, [version]);

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

  const pedidoDTO = useMemo<CrearPedidoDTO>(
    () => ({
      detalles: productos.map((item) => ({
        id_articulo: item.id,
        cantidadArticulos: item.cantidad,
      })),
    }),
    [productos],
  );

  const reintentar = () => {
    setVersion((actual) => actual + 1);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-8 md:px-6">
      <header>
        <Link
          to="/tienda/carrito"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#991b1b] hover:underline"
        >
          <ArrowLeft size={17} />
          Volver al carrito
        </Link>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
            Apex Commerce
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#131b2e]">
            Confirmar compra
          </h1>

          <p className="mt-2 text-sm text-[#897b78]">
            Revisa tu pedido antes de continuar al pago.
          </p>
        </div>
      </header>

      {verificando && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <RefreshCw size={19} className="animate-spin" />
          Verificando disponibilidad y precios...
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"
        >
          <div className="flex items-start gap-3 text-sm text-amber-800">
            <AlertTriangle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={reintentar}
            disabled={verificando}
            className="rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-900"
          >
            Reintentar
          </button>
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Cliente */}
          <section className="rounded-xl border border-[#ebe7e6] bg-white p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold">
              <UserRound size={21} className="text-[#991b1b]" />
              Información del cliente
            </h2>

            <div className="mt-5 rounded-lg bg-[#faf8ff] p-4">
              <p className="font-semibold text-[#131b2e]">
                {usuario
                  ? `${usuario.nombre} ${usuario.apellido}`
                  : "Sin sesión"}
              </p>

              <p className="mt-1 text-sm text-[#897b78]">
                {usuario?.email ?? "No disponible"}
              </p>
            </div>

            <p className="mt-3 text-xs text-[#897b78]">
              El pedido se asociará a tu cuenta.
            </p>
          </section>

          {/* Productos */}
          <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
            <div className="border-b border-[#ebe7e6] p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <ShoppingBag size={20} className="text-[#991b1b]" />
                Productos de tu pedido
              </h2>
            </div>

            <div className="divide-y divide-[#ebe7e6]">
              {productos.map((producto) => (
                <div key={producto.id} className="flex items-center gap-4 p-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-[#f5f1f3]">
                    <Package size={30} className="text-[#b6a8ac]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#131b2e]">
                      {producto.nombre}
                    </p>

                    <p className="mt-1 text-sm text-[#897b78]">
                      {producto.cantidad} × {moneda(producto.precioVenta)}
                    </p>
                  </div>

                  <p className="font-bold text-[#131b2e]">
                    {moneda(Number(producto.precioVenta) * producto.cantidad)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Pago */}
          <section className="rounded-xl border border-[#ebe7e6] bg-white p-6">
            <h2 className="flex items-center gap-3 text-lg font-bold">
              <CreditCard size={21} className="text-[#991b1b]" />
              Método de pago
            </h2>

            <div className="mt-5 rounded-xl border border-dashed border-[#d9c6c9] bg-[#faf8ff] p-5">
              <div className="flex items-center gap-3">
                <LockKeyhole size={23} className="text-[#991b1b]" />

                <div>
                  <p className="font-semibold">Pago en línea</p>

                  <p className="mt-1 text-sm text-[#897b78]">
                    Próximamente disponible mediante MockPay.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Resumen */}
        <aside className="rounded-xl border border-[#ebe7e6] bg-white p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-bold">Resumen de compra</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[#897b78]">
                Artículos ({cantidadTotal})
              </span>

              <span className="font-semibold">{moneda(subtotal)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#897b78]">Envío</span>

              <span>Por definir</span>
            </div>

            <div className="border-t border-[#ebe7e6] pt-4">
              <div className="flex justify-between">
                <span className="font-bold">Total de productos</span>

                <span className="text-xl font-bold text-[#991b1b]">
                  {moneda(subtotal)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-300 px-4 py-3 font-semibold text-white"
          >
            <LockKeyhole size={18} />
            Pago no disponible
          </button>

          <div className="mt-5 flex items-start gap-2 text-xs text-[#897b78]">
            <ShieldCheck size={17} className="shrink-0 text-green-600" />

            <p>
              Tu pedido todavía no se ha enviado. No se realizará ningún cargo.
            </p>
          </div>

          {verificado && (
            <p className="mt-3 text-center text-xs text-green-700">
              Precios y existencias verificados.
            </p>
          )}
        </aside>
      </div>

      {/* Preparación del DTO */}
      {import.meta.env.DEV && (
        <details className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <summary className="cursor-pointer font-semibold text-[#131b2e]">
            Vista de desarrollo: DTO del pedido
          </summary>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-[#131b2e] p-4 text-xs text-white">
            {JSON.stringify(pedidoDTO, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
