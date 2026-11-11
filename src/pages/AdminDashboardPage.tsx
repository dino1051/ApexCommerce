import { Link } from "react-router-dom";
import {
  Monitor,
  Wallet,
  Package,
  Truck,
  ReceiptText,
  ArrowRight,
  Banknote,
  RefreshCw,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";

export function AdminDashboardPage() {
  const {
    resumen,
    resumenPedidos,
    sesionesAbiertas,
    cargando,
    error,
    recargar,
  } = useDashboard();

  const formatoMoneda = (valor: string | number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(Number(valor));

  return (
    <div className="min-h-screen">
      {/* CABECERA DEL DASHBOARD */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void recargar()}
            disabled={cargando}
            className="
      inline-flex items-center justify-center gap-2
      rounded-lg border border-[#e5e1e0]
      bg-white px-4 py-2.5
      text-sm font-semibold text-[#59413e]
      transition-colors hover:bg-[#f7f5fa]
      disabled:cursor-not-allowed disabled:opacity-50
    "
          >
            <RefreshCw size={18} className={cargando ? "animate-spin" : ""} />
            Actualizar
          </button>

          <Link
            to="/admin/pos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#760009]"
          >
            <Monitor size={19} />
            Abrir POS
          </Link>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            titulo="Ventas del día"
            valor={resumen ? formatoMoneda(resumen.totalVendido) : "--"}
            descripcion={
              resumen
                ? `${resumen.cantidadVentas} ventas completadas`
                : "Total de ventas POS"
            }
            icono={Banknote}
          />

          <KpiCard
            titulo="Pedidos pendientes"
            valor={
              resumenPedidos ? String(resumenPedidos.pedidosPendientes) : "--"
            }
            descripcion="Pedidos por atender"
            icono={Truck}
          />

          <KpiCard
            titulo="Stock bajo"
            valor="--"
            descripcion="Productos que requieren atención"
            icono={Package}
          />

          <KpiCard
            titulo="Estado de caja"
            valor={
              cargando && !resumen
                ? "Cargando..."
                : `${sesionesAbiertas.length} abiertas`
            }
            descripcion="Sesiones de caja activas"
            icono={Wallet}
          />
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* VENTAS RECIENTES */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Ventas recientes</h2>

                <p className="text-sm text-[#59413e] mt-0.5">
                  Últimas ventas registradas.
                </p>
              </div>

              <Link
                to="/admin/ventas"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f7f5fa] text-[#59413e] text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3">Venta</th>

                    <th className="px-5 py-3">Fecha</th>

                    <th className="px-5 py-3">Método</th>

                    <th className="px-5 py-3 text-right">Total</th>

                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {resumen?.ventasRecientes.length ? (
                    resumen.ventasRecientes.map((venta) => (
                      <tr
                        key={venta.id}
                        className="border-t border-[#ebe7e6] text-sm"
                      >
                        <td className="px-5 py-4 font-semibold">#{venta.id}</td>

                        <td className="px-5 py-4">
                          {new Date(venta.fecha).toLocaleString("es-MX", {
                            dateStyle: "short",
                            timeStyle: "short",
                            timeZone: "America/Mexico_City",
                          })}
                        </td>

                        <td className="px-5 py-4">
                          {venta.tipo_pago.replaceAll("_", " ")}
                        </td>

                        <td className="px-5 py-4 text-right font-semibold">
                          {formatoMoneda(venta.total)}
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span
                            className={`
              inline-flex rounded-full px-2.5 py-1
              text-xs font-semibold
              ${
                venta.estado === "COMPLETADA"
                  ? "bg-green-100 text-green-700"
                  : venta.estado === "CANCELADA"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }
            `}
                          >
                            {venta.estado.replaceAll("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <EmptyTableState
                          icono={ReceiptText}
                          mensaje={
                            cargando
                              ? "Cargando ventas..."
                              : error
                                ? "No fue posible cargar las ventas."
                                : "No hay ventas para mostrar."
                          }
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] p-5">
            <h2 className="font-bold text-lg">Acciones rápidas</h2>

            <p className="text-sm text-[#59413e] mt-1 mb-4">
              Accede rápidamente a las operaciones principales.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                ruta="/admin/pos"
                icono={Monitor}
                titulo="Nueva venta"
              />

              <QuickAction
                ruta="/admin/productos"
                icono={Package}
                titulo="Productos"
              />

              <QuickAction
                ruta="/admin/pedidos"
                icono={Truck}
                titulo="Pedidos"
              />

              <QuickAction ruta="/admin/caja" icono={Wallet} titulo="Caja" />
            </div>
          </div>
        </section>

        {/* PEDIDOS Y STOCK */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* PEDIDOS */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Pedidos recientes</h2>

                <p className="text-sm text-[#59413e]">
                  Pedidos generados desde la tienda.
                </p>
              </div>

              <Link
                to="/admin/pedidos"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver pedidos
              </Link>
            </div>

            <div className="p-5">
              <EmptyState
                icono={Truck}
                titulo="Sin pedidos recientes"
                descripcion="Los pedidos de la tienda aparecerán aquí."
              />
            </div>
          </div>

          {/* STOCK */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Stock bajo</h2>

                <p className="text-sm text-[#59413e]">
                  Productos con poca disponibilidad.
                </p>
              </div>

              <Link
                to="/admin/productos"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver catálogo
              </Link>
            </div>

            <div className="p-5">
              <EmptyState
                icono={Package}
                titulo="Sin alertas de stock"
                descripcion="Los productos con stock bajo aparecerán aquí."
              />
            </div>
          </div>
        </section>

        {/* CAJA */}
        <section className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center">
                <Wallet size={22} className="text-[#760009]" />
              </div>

              <div>
                <h2 className="font-bold">Caja</h2>

                <p className="text-sm text-[#59413e] mt-0.5">
                  Consulta el estado de la caja y realiza la apertura o cierre.
                </p>
              </div>
            </div>

            <Link
              to="/admin/caja"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#991b1b] text-[#760009] hover:bg-[#fdf0f0] rounded-lg text-sm font-bold transition-colors"
            >
              Administrar caja
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* --------------------------------
   COMPONENTES
--------------------------------- */

interface KpiCardProps {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: LucideIcon;
}

function KpiCard({ titulo, valor, descripcion, icono: Icono }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[#ebe7e6] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#59413e]">
            {titulo}
          </p>

          <p className="mt-1 text-2xl font-extrabold">{valor}</p>

          <p className="mt-1 text-xs text-[#59413e]">{descripcion}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f2f3ff]">
          <Icono size={22} className="text-[#760009]" />
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  ruta: string;
  icono: LucideIcon;
  titulo: string;
}

function QuickAction({ ruta, icono: Icono, titulo }: QuickActionProps) {
  return (
    <Link
      to={ruta}
      className="group flex flex-col items-center justify-center gap-2 rounded-lg bg-[#f7f5fa] p-4 text-center transition-colors hover:bg-[#efedf5]"
    >
      <Icono
        size={24}
        className="text-[#760009] transition-transform group-hover:scale-110"
      />

      <span className="text-xs font-bold">{titulo}</span>
    </Link>
  );
}

interface EmptyStateProps {
  icono: LucideIcon;
  titulo: string;
  descripcion: string;
}

function EmptyState({ icono: Icono, titulo, descripcion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f3ff]">
        <Icono size={24} className="text-[#760009]" />
      </div>

      <p className="text-sm font-bold">{titulo}</p>

      <p className="mt-1 max-w-sm text-xs text-[#59413e]">{descripcion}</p>
    </div>
  );
}

interface EmptyTableStateProps {
  icono: LucideIcon;
  mensaje: string;
}

function EmptyTableState({ icono: Icono, mensaje }: EmptyTableStateProps) {
  return (
    <div className="flex flex-col items-center">
      <Icono size={32} className="mb-2 text-[#59413e]/50" />

      <p className="text-sm text-[#59413e]">{mensaje}</p>
    </div>
  );
}
