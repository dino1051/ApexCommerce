import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  CalendarDays,
  ArrowRight,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

import { useMisPedidosWebStore } from "../../store/useMisPedidosWebStore";
import EstadoPedidoBadge from "../../components/ventasWeb/EstadoPedidoBadge";
import MiPedidoDetalleModal from "../../components/tienda/MiPedidoDetalleModal";

const moneda = (valor: number | string) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

const fecha = (valor: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(valor));

export default function MisPedidosPage() {
  const pedidos = useMisPedidosWebStore((state) => state.pedidos);

  const cargando = useMisPedidosWebStore((state) => state.cargando);

  const error = useMisPedidosWebStore((state) => state.error);

  const cargarPedidos = useMisPedidosWebStore((state) => state.cargarPedidos);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<number | null>(
    null,
  );

  useEffect(() => {
    void cargarPedidos();
  }, [cargarPedidos]);

  return (
    <div className="mx-auto max-w-5xl space-y-7 px-4 py-8 md:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
            Mi cuenta
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#131b2e]">
            Mis pedidos
          </h1>

          <p className="mt-2 text-sm text-[#897b78]">
            Consulta tus compras y su estado actual.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarPedidos()}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {cargando && pedidos.length === 0 ? (
        <div className="py-16 text-center text-[#897b78]">
          Cargando tus pedidos...
        </div>
      ) : !error && pedidos.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-[#ebe7e6] bg-white px-5 py-16 text-center">
          <div className="rounded-full bg-[#fff1f2] p-6">
            <ShoppingCart size={44} className="text-[#991b1b]" />
          </div>

          <h2 className="text-xl font-bold text-[#131b2e]">
            Todavía no tienes pedidos
          </h2>

          <p className="max-w-md text-sm text-[#897b78]">
            Cuando realices tu primera compra, podrás consultar aquí su
            información.
          </p>

          <Link
            to="/tienda/productos"
            className="rounded-lg bg-[#991b1b] px-5 py-3 font-semibold text-white hover:bg-[#760009]"
          >
            Explorar productos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidos.map((pedido) => {
            const cantidadArticulos = pedido.detallesventaweb.reduce(
              (total, detalle) => total + detalle.cantidadArticulos,
              0,
            );

            return (
              <article
                key={pedido.id}
                className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebe7e6] bg-[#faf8ff] px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-[#fff1f2] p-3 text-[#991b1b]">
                      <ShoppingBag size={20} />
                    </div>

                    <div>
                      <h2 className="font-bold text-[#131b2e]">
                        Pedido #{pedido.id}
                      </h2>

                      <p className="mt-1 flex items-center gap-1 text-xs text-[#897b78]">
                        <CalendarDays size={13} />
                        {fecha(pedido.fecha)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <EstadoPedidoBadge
                      estado={pedido.estadoweb}
                      tipo="pedido"
                    />

                    <EstadoPedidoBadge
                      estado={pedido.estado_pago}
                      tipo="pago"
                    />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <Package
                      size={21}
                      className="mt-1 shrink-0 text-[#991b1b]"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#131b2e]">
                        {cantidadArticulos} artículos
                      </p>

                      <p className="mt-1 text-sm text-[#897b78]">
                        {pedido.detallesventaweb
                          .map((detalle) => detalle.articulo.nombre)
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#ebe7e6] pt-5">
                    <div>
                      <p className="text-xs text-[#897b78]">Total del pedido</p>

                      <p className="mt-1 text-2xl font-bold text-[#991b1b]">
                        {moneda(pedido.total)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPedidoSeleccionado(pedido.id)}
                      className="flex items-center gap-2 rounded-lg border border-[#991b1b] px-4 py-2.5 text-sm font-semibold text-[#991b1b] hover:bg-[#fff1f2]"
                    >
                      Ver detalle
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {pedidoSeleccionado !== null && (
        <MiPedidoDetalleModal
          idPedido={pedidoSeleccionado}
          onCerrar={() => setPedidoSeleccionado(null)}
        />
      )}
    </div>
  );
}
