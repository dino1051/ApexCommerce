import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { X, ReceiptText, Wallet, CreditCard, Banknote } from "lucide-react";

import { cajasService } from "../../services/cajas";
import type { DetalleSesionCaja } from "../../types/cajas";

interface Props {
  idSesion: number;
  onCerrar: () => void;
}

const moneda = (valor: number | string) =>
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

export default function DetalleSesionModal({ idSesion, onCerrar }: Props) {
  const [detalle, setDetalle] = useState<DetalleSesionCaja | null>(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);
      setError(null);
      setDetalle(null);

      try {
        const datos = await cajasService.obtenerDetalle(idSesion);

        if (activo) {
          setDetalle(datos);
        }
      } catch (error) {
        if (!activo) return;

        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message ?? "No fue posible cargar la sesión.",
          );
        } else {
          setError("No fue posible cargar la sesión.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    void cargar();

    return () => {
      activo = false;
    };
  }, [idSesion]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-detalle-sesion"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div>
            <h2
              id="titulo-detalle-sesion"
              className="text-xl font-bold text-[#131b2e]"
            >
              Detalle de sesión #{idSesion}
            </h2>
            <p className="mt-1 text-sm text-[#897b78]">
              Información de la jornada de caja
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
          <p className="p-10 text-center text-[#897b78]">Cargando detalle...</p>
        ) : error ? (
          <p role="alert" className="p-6 text-red-600">
            {error}
          </p>
        ) : detalle ? (
          <div className="space-y-6 p-5">
            {/* Información de la sesión */}
            <div className="rounded-xl bg-[#faf8ff] p-4">
              <h3 className="mb-3 font-bold text-[#131b2e]">
                Información general
              </h3>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-[#897b78]">Caja: </span>#
                  {detalle.sesion.pos.numero}
                </p>

                <p>
                  <span className="text-[#897b78]">Cajero: </span>
                  {detalle.sesion.usuario.nombre}{" "}
                  {detalle.sesion.usuario.apellido}
                </p>

                <p>
                  <span className="text-[#897b78]">Apertura: </span>
                  {fecha(detalle.sesion.fecha_apertura)}
                </p>

                <p>
                  <span className="text-[#897b78]">Cierre: </span>
                  {detalle.sesion.fecha_cierre
                    ? fecha(detalle.sesion.fecha_cierre)
                    : "Sesión abierta"}
                </p>
              </div>
            </div>

            {/* Resumen */}
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  titulo: "Total ventas completadas",
                  valor: detalle.resumen.totalVentas,
                  icono: ReceiptText,
                },
                {
                  titulo: "Ventas en efectivo",
                  valor: detalle.resumen.ventasPorMetodo.EFECTIVO,
                  icono: Banknote,
                },
                {
                  titulo: "Ventas con tarjeta",
                  valor: detalle.resumen.ventasPorMetodo.TARJETA,
                  icono: CreditCard,
                },
                {
                  titulo: "Ventas por transferencia QR",
                  valor: detalle.resumen.ventasPorMetodo.TRANSFERENCIAQR,
                  icono: Wallet,
                },
              ].map((item) => {
                const Icono = item.icono;

                return (
                  <div
                    key={item.titulo}
                    className="rounded-xl border border-[#ebe7e6] p-4"
                  >
                    <div className="mb-2 flex items-center gap-2 text-[#991b1b]">
                      <Icono size={18} />
                      <span className="text-sm font-semibold">
                        {item.titulo}
                      </span>
                    </div>

                    <p className="text-xl font-bold text-[#131b2e]">
                      {moneda(item.valor)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Arqueo */}
            <div className="rounded-xl border border-[#ebe7e6] p-4">
              <h3 className="mb-4 font-bold text-[#131b2e]">
                Arqueo de efectivo
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Fondo inicial</span>
                  <strong>{moneda(detalle.sesion.monto_inicial)}</strong>
                </div>

                <div className="flex justify-between">
                  <span>Efectivo esperado (estimado)</span>
                  <strong>
                    {moneda(detalle.resumen.arqueo.efectivoEsperado)}
                  </strong>
                </div>

                <div className="flex justify-between">
                  <span>Efectivo contado</span>
                  <strong>
                    {detalle.resumen.arqueo.efectivoContado === null
                      ? "Pendiente"
                      : moneda(detalle.resumen.arqueo.efectivoContado)}
                  </strong>
                </div>

                <div className="flex justify-between border-t border-[#ebe7e6] pt-3">
                  <span className="font-bold">Diferencia estimada</span>

                  <strong className="text-[#991b1b]">
                    {detalle.resumen.arqueo.diferencia === null
                      ? "Pendiente"
                      : moneda(detalle.resumen.arqueo.diferencia)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Cancelaciones y devoluciones */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#ebe7e6] p-4">
                <p className="text-sm text-[#897b78]">Cancelaciones</p>
                <p className="mt-1 text-xl font-bold">
                  {detalle.resumen.cancelaciones.cantidad}
                </p>
                <p className="text-sm">
                  {moneda(detalle.resumen.cancelaciones.total)}
                </p>
              </div>

              <div className="rounded-xl border border-[#ebe7e6] p-4">
                <p className="text-sm text-[#897b78]">Devoluciones</p>
                <p className="mt-1 text-xl font-bold">
                  {detalle.resumen.devoluciones.cantidad}
                </p>
                <p className="text-sm">
                  {moneda(detalle.resumen.devoluciones.total)}
                </p>
              </div>
            </div>

            {/* Ventas */}
            <div>
              <h3 className="mb-4 font-bold text-[#131b2e]">
                Ventas de la sesión
              </h3>

              {detalle.ventas.length === 0 ? (
                <p className="text-sm text-[#897b78]">
                  No se registraron ventas.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#ebe7e6]">
                  <table className="w-full min-w-[550px] text-left text-sm">
                    <thead className="bg-[#faf8ff] text-[#766b69]">
                      <tr>
                        <th className="px-4 py-3">Venta</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Pago</th>
                        <th className="px-4 py-3">Estado</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#ebe7e6]">
                      {detalle.ventas.map((venta) => (
                        <tr key={venta.id}>
                          <td className="px-4 py-3 font-semibold text-[#991b1b]">
                            #{venta.id}
                          </td>

                          <td className="px-4 py-3">{fecha(venta.fecha)}</td>

                          <td className="px-4 py-3">{venta.tipo_pago}</td>

                          <td className="px-4 py-3">{venta.estado}</td>

                          <td className="px-4 py-3 text-right font-semibold">
                            {moneda(venta.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
