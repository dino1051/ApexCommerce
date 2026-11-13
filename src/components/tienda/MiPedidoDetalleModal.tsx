import { useEffect, useState } from "react";
import { X, Package, CalendarDays } from "lucide-react";

import { misPedidosWebService } from "../../services/misPedidosWeb";
import type { MiPedidoWeb } from "../../types/misPedidosWeb";
import EstadoPedidoBadge from "../ventasWeb/EstadoPedidoBadge";

interface Props {
  idPedido: number;
  onCerrar: () => void;
}

const moneda = (valor: string | number) =>
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

export default function MiPedidoDetalleModal({ idPedido, onCerrar }: Props) {
  const [pedido, setPedido] = useState<MiPedidoWeb | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarDetalle = async () => {
      setCargando(true);
      setError(null);

      try {
        const datos = await misPedidosWebService.obtenerPorId(idPedido);

        if (activo) setPedido(datos);
      } catch {
        if (activo) {
          setError("No fue posible consultar el detalle del pedido.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    void cargarDetalle();

    return () => {
      activo = false;
    };
  }, [idPedido]);

  useEffect(() => {
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCerrar();
    };

    window.addEventListener("keydown", cerrarConEscape);

    return () => window.removeEventListener("keydown", cerrarConEscape);
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-mi-pedido"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div>
            <h2
              id="titulo-mi-pedido"
              className="text-xl font-bold text-[#131b2e]"
            >
              Pedido #{idPedido}
            </h2>

            <p className="mt-1 text-sm text-[#897b78]">
              Información de tu compra
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        {cargando ? (
          <p className="p-10 text-center text-[#897b78]">Cargando pedido...</p>
        ) : error ? (
          <p role="alert" className="p-6 text-red-600">
            {error}
          </p>
        ) : pedido ? (
          <div className="space-y-6 p-5">
            <div className="flex flex-wrap gap-2">
              <EstadoPedidoBadge estado={pedido.estadoweb} tipo="pedido" />

              <EstadoPedidoBadge estado={pedido.estado_pago} tipo="pago" />
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#faf8ff] p-4 text-sm">
              <CalendarDays size={18} className="text-[#991b1b]" />
              {fecha(pedido.fecha)}
            </div>

            <section>
              <h3 className="mb-4 flex items-center gap-2 font-bold">
                <Package size={19} className="text-[#991b1b]" />
                Artículos comprados
              </h3>

              <div className="divide-y divide-[#ebe7e6] rounded-xl border border-[#ebe7e6]">
                {pedido.detallesventaweb.map((detalle) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between gap-4 p-4"
                  >
                    <div>
                      <p className="font-semibold">{detalle.articulo.nombre}</p>

                      <p className="mt-1 text-sm text-[#897b78]">
                        Cantidad: {detalle.cantidadArticulos}
                      </p>

                      {(detalle.cantidadDevuelta ?? 0) > 0 && (
                        <p className="mt-1 text-xs text-amber-700">
                          Unidades devueltas: {detalle.cantidadDevuelta}
                        </p>
                      )}
                    </div>

                    <p className="font-bold text-[#131b2e]">
                      {moneda(detalle.subtotal)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-center justify-between rounded-xl bg-[#fff1f2] p-5">
              <span className="font-semibold text-[#991b1b]">
                Total original
              </span>

              <span className="text-2xl font-bold text-[#991b1b]">
                {moneda(pedido.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={onCerrar}
              className="w-full rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009]"
            >
              Cerrar
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
