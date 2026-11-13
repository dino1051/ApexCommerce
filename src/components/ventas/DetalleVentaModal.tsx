import { useEffect } from "react";
import {
  X,
  ReceiptText,
  CalendarDays,
  CreditCard,
  Package,
} from "lucide-react";

import type { VentaCajero } from "../../types/misVentas";
import type { TipoPago } from "../../types/pos";

interface DetalleVentaModalProps {
  venta: VentaCajero | null;
  onCerrar: () => void;
}

const formatoMoneda = (valor: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

const formatoFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(fecha));

const nombresPago: Record<TipoPago, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIAQR: "Transferencia QR",
};

export function DetalleVentaModal({ venta, onCerrar }: DetalleVentaModalProps) {
  useEffect(() => {
    if (!venta) return;

    const manejarTecla = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCerrar();
      }
    };

    window.addEventListener("keydown", manejarTecla);

    return () => {
      window.removeEventListener("keydown", manejarTecla);
    };
  }, [venta, onCerrar]);

  if (!venta) return null;

  const nombresEstado = {
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
    DEVUELTA: "Devuelta",
    DEVUELTA_PARCIAL: "Devuelta parcial",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle-venta"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        {/* Encabezado */}
        <header className="flex items-start justify-between border-b border-[#ebe7e6] p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#fff1f2] p-3 text-[#991b1b]">
              <ReceiptText size={24} />
            </div>

            <div>
              <h2
                id="titulo-detalle-venta"
                className="text-xl font-bold text-[#131b2e]"
              >
                Venta #{venta.id}
              </h2>

              <p className="mt-1 text-sm text-[#897b78]">
                {nombresEstado[venta.estado]}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalle"
            className="rounded-lg p-2 text-[#766b69] hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {/* Información general */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <CalendarDays size={19} className="mt-0.5 text-[#991b1b]" />

              <div>
                <p className="text-xs text-[#897b78]">Fecha de venta</p>

                <p className="mt-1 text-sm font-semibold">
                  {formatoFecha(venta.fecha)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard size={19} className="mt-0.5 text-[#991b1b]" />

              <div>
                <p className="text-xs text-[#897b78]">Método de pago</p>

                <p className="mt-1 text-sm font-semibold">
                  {nombresPago[venta.tipo_pago]}
                </p>
              </div>
            </div>
          </div>

          {/* Artículos */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Package size={19} className="text-[#991b1b]" />

              <h3 className="font-bold text-[#131b2e]">Artículos vendidos</h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#ebe7e6]">
              {venta.detallesVenta.length === 0 ? (
                <p className="p-5 text-center text-sm text-[#897b78]">
                  No hay detalles disponibles.
                </p>
              ) : (
                <div className="divide-y divide-[#ebe7e6]">
                  {venta.detallesVenta.map((detalle) => {
                    const precioUnitario =
                      Number(detalle.subtotal) / detalle.cantidadArticulos;

                    return (
                      <div
                        key={detalle.id}
                        className="flex items-center justify-between gap-3 p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#131b2e]">
                            {detalle.articulo.nombre}
                          </p>

                          <p className="mt-1 text-xs text-[#897b78]">
                            {detalle.cantidadArticulos} ×{" "}
                            {formatoMoneda(precioUnitario)}
                          </p>
                        </div>

                        <span className="font-bold text-[#131b2e]">
                          {formatoMoneda(detalle.subtotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="rounded-xl bg-[#fff1f2] p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#59413e]">
                Total de la venta
              </span>

              <span className="text-2xl font-bold text-[#991b1b]">
                {formatoMoneda(venta.total)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="w-full rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009]"
          >
            Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}
