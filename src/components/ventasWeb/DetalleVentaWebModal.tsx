import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { X, Package, UserRound, CreditCard, CalendarDays } from "lucide-react";

import { ventasWebService } from "../../services/ventasWeb";
import type { VentaWebDetalle } from "../../types/ventasWeb";
import EstadoPedidoBadge from "./EstadoPedidoBadge";
import CambiarEstadoPedido from "./CambiarEstadoPedido";

interface Props {
  idVenta: number;
  onCerrar: () => void;
}

const moneda = (valor: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

const fecha = (valor: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(valor));

export default function DetalleVentaWebModal({ idVenta, onCerrar }: Props) {
  const [venta, setVenta] = useState<VentaWebDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarDetalle = async () => {
      setCargando(true);
      setError(null);
      setVenta(null);

      try {
        const datos = await ventasWebService.obtenerPorId(idVenta);

        if (activo) setVenta(datos);
      } catch (error) {
        if (!activo) return;

        let mensaje = "No fue posible consultar el pedido.";

        if (error instanceof AxiosError) {
          const respuesta = error.response?.data?.message;

          if (typeof respuesta === "string") {
            mensaje = respuesta;
          }
        }

        setError(mensaje);
      } finally {
        if (activo) setCargando(false);
      }
    };

    void cargarDetalle();

    return () => {
      activo = false;
    };
  }, [idVenta]);

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
        aria-labelledby="titulo-detalle-web"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div>
            <h2
              id="titulo-detalle-web"
              className="text-xl font-bold text-[#131b2e]"
            >
              Pedido #{idVenta}
            </h2>

            <p className="mt-1 text-sm text-[#897b78]">
              Detalle de la venta web
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
        ) : venta ? (
          <div className="space-y-6 p-5">
            {/* Estados */}
            <div className="flex flex-wrap gap-3">
              <EstadoPedidoBadge estado={venta.estadoweb} tipo="pedido" />

              <EstadoPedidoBadge estado={venta.estado_pago} tipo="pago" />
            </div>

            {/* Información */}
            <div className="grid gap-4 rounded-xl bg-[#faf8ff] p-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 flex items-center gap-2 text-xs text-[#897b78]">
                  <UserRound size={15} />
                  Cliente
                </p>

                <p className="font-semibold">
                  {venta.usuario.nombre} {venta.usuario.apellido}
                </p>

                <p className="text-sm text-[#766b69]">{venta.usuario.email}</p>
              </div>

              <div>
                <p className="mb-1 flex items-center gap-2 text-xs text-[#897b78]">
                  <CalendarDays size={15} />
                  Fecha del pedido
                </p>

                <p className="font-semibold">{fecha(venta.fecha)}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="mb-1 flex items-center gap-2 text-xs text-[#897b78]">
                  <CreditCard size={15} />
                  Referencia de pago
                </p>

                <p className="break-all font-mono text-sm">
                  {venta.id_pago_externo ?? "Sin referencia"}
                </p>
              </div>
            </div>

            {/* Artículos */}
            <section>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-[#131b2e]">
                <Package size={19} className="text-[#991b1b]" />
                Artículos del pedido
              </h3>

              <div className="overflow-x-auto rounded-xl border border-[#ebe7e6]">
                <table className="w-full min-w-[450px] text-left text-sm">
                  <thead className="bg-[#faf8ff] text-[#766b69]">
                    <tr>
                      <th className="px-4 py-3">Artículo</th>
                      <th className="px-4 py-3 text-center">Cantidad</th>
                      <th className="px-4 py-3 text-right">Precio unitario</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#ebe7e6]">
                    {venta.detallesventaweb.map((detalle) => {
                      const precioUnitario =
                        Number(detalle.subtotal) / detalle.cantidadArticulos;

                      return (
                        <tr key={detalle.id}>
                          <td className="px-4 py-3">
                            <p className="font-semibold">
                              {detalle.articulo.nombre}
                            </p>

                            {detalle.cantidadDevuelta > 0 && (
                              <p className="mt-1 text-xs text-amber-700">
                                Devueltos: {detalle.cantidadDevuelta}
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-3 text-center">
                            {detalle.cantidadArticulos}
                          </td>

                          <td className="px-4 py-3 text-right">
                            {moneda(precioUnitario)}
                          </td>

                          <td className="px-4 py-3 text-right font-semibold">
                            {moneda(detalle.subtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Total */}
            <div className="flex items-center justify-between rounded-xl bg-[#fff1f2] p-5">
              <span className="font-semibold text-[#991b1b]">
                Total original del pedido
              </span>

              <span className="text-2xl font-bold text-[#991b1b]">
                {moneda(venta.total)}
              </span>
            </div>
            <CambiarEstadoPedido
              idVenta={venta.id}
              estado={venta.estadoweb}
              estadoPago={venta.estado_pago}
              onActualizado={onCerrar}
            />
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
