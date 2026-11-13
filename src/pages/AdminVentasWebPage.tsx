import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Wallet,
  RefreshCw,
  Search,
  Eye,
} from "lucide-react";

import { useVentasWebStore } from "../store/useVentasWebStore";
import EstadoPedidoBadge from "../components/ventasWeb/EstadoPedidoBadge";
import DetalleVentaWebModal from "../components/ventasWeb/DetalleVentaWebModal";

import type { EstadoPedidoWeb, EstadoPagoWeb } from "../types/ventasWeb";

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

type FiltroPedido = EstadoPedidoWeb | "TODOS";
type FiltroPago = EstadoPagoWeb | "TODOS";

export default function AdminVentasWebPage() {
  const ventas = useVentasWebStore((state) => state.ventas);
  const cargando = useVentasWebStore((state) => state.cargando);
  const error = useVentasWebStore((state) => state.error);
  const cargarVentas = useVentasWebStore((state) => state.cargarVentas);

  const [busqueda, setBusqueda] = useState("");
  const [filtroPedido, setFiltroPedido] = useState<FiltroPedido>("TODOS");
  const [filtroPago, setFiltroPago] = useState<FiltroPago>("TODOS");

  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    void cargarVentas();
  }, [cargarVentas]);

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return ventas.filter((venta) => {
      const nombreCliente =
        `${venta.usuario.nombre} ${venta.usuario.apellido}`.toLowerCase();

      const coincideBusqueda =
        String(venta.id).includes(texto) ||
        nombreCliente.includes(texto) ||
        venta.usuario.email.toLowerCase().includes(texto);

      const coincidePedido =
        filtroPedido === "TODOS" || venta.estadoweb === filtroPedido;

      const coincidePago =
        filtroPago === "TODOS" || venta.estado_pago === filtroPago;

      return coincideBusqueda && coincidePedido && coincidePago;
    });
  }, [ventas, busqueda, filtroPedido, filtroPago]);

  const estadisticas = useMemo(() => {
    const pendientes = ventas.filter(
      (venta) => venta.estadoweb === "PENDIENTE",
    ).length;

    const pagados = ventas.filter((venta) => venta.estado_pago === "PAGADO");

    const ingresosPagados = pagados.reduce(
      (total, venta) => total + Number(venta.total),
      0,
    );

    return {
      total: ventas.length,
      pendientes,
      pagados: pagados.length,
      ingresosPagados,
    };
  }, [ventas]);

  const tarjetas = [
    {
      titulo: "Total de pedidos",
      valor: estadisticas.total,
      icono: ShoppingBag,
    },
    {
      titulo: "Pedidos pendientes",
      valor: estadisticas.pendientes,
      icono: Clock3,
    },
    {
      titulo: "Pagos confirmados",
      valor: estadisticas.pagados,
      icono: CheckCircle2,
    },
    {
      titulo: "Importe de pagos confirmados",
      valor: moneda(estadisticas.ingresosPagados),
      icono: Wallet,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#991b1b]">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#131b2e]">Ventas Web</h1>

          <p className="mt-2 text-sm text-[#766b69]">
            Consulta y administra los pedidos de la tienda.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarVentas()}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {tarjetas.map((tarjeta) => {
          const Icono = tarjeta.icono;

          return (
            <div
              key={tarjeta.titulo}
              className="rounded-xl border border-[#ebe7e6] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#fff1f2] p-3 text-[#991b1b]">
                  <Icono size={22} />
                </div>

                <div>
                  <p className="text-sm text-[#766b69]">{tarjeta.titulo}</p>

                  <p className="mt-1 text-xl font-bold text-[#131b2e]">
                    {tarjeta.valor}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <section className="rounded-xl border border-[#ebe7e6] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Pedido, cliente o correo..."
              className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <select
            value={filtroPedido}
            onChange={(e) => setFiltroPedido(e.target.value as FiltroPedido)}
            aria-label="Filtrar por estado del pedido"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODOS">Todos los pedidos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="PAGADO">Pagado</option>
            <option value="EN_CAMINO">En camino</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>

          <select
            value={filtroPago}
            onChange={(e) => setFiltroPago(e.target.value as FiltroPago)}
            aria-label="Filtrar por estado del pago"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODOS">Todos los pagos</option>
            <option value="PENDIENTE">Pago pendiente</option>
            <option value="PAGADO">Pagado</option>
            <option value="RECHAZADO">Rechazado</option>
            <option value="REEMBOLSADO">Reembolsado</option>
          </select>
        </div>
      </section>

      {/* Tabla */}
      <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
        <div className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <h2 className="font-bold text-[#131b2e]">Pedidos registrados</h2>

          <span className="text-sm text-[#897b78]">
            {ventasFiltradas.length} resultados
          </span>
        </div>

        {cargando && ventas.length === 0 ? (
          <p className="py-12 text-center text-[#897b78]">
            Cargando pedidos...
          </p>
        ) : ventasFiltradas.length === 0 ? (
          <p className="py-12 text-center text-[#897b78]">
            No se encontraron pedidos.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-[#faf8ff] text-xs uppercase text-[#766b69]">
                <tr>
                  <th className="px-5 py-4">Pedido</th>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Pago</th>
                  <th className="px-5 py-4 text-right">Total</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0eceb]">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-[#faf8ff]">
                    <td className="px-5 py-4 font-semibold text-[#991b1b]">
                      #{venta.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold">
                        {venta.usuario.nombre} {venta.usuario.apellido}
                      </p>

                      <p className="mt-1 text-xs text-[#897b78]">
                        {venta.usuario.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">{fecha(venta.fecha)}</td>

                    <td className="px-5 py-4">
                      <EstadoPedidoBadge
                        estado={venta.estadoweb}
                        tipo="pedido"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <EstadoPedidoBadge
                        estado={venta.estado_pago}
                        tipo="pago"
                      />
                    </td>

                    <td className="px-5 py-4 text-right font-semibold">
                      {moneda(venta.total)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setIdSeleccionado(venta.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#ebe7e6] px-3 py-2 text-xs font-semibold text-[#991b1b] hover:bg-[#fff1f2]"
                      >
                        <Eye size={15} />
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {idSeleccionado !== null && (
        <DetalleVentaWebModal
          idVenta={idSeleccionado}
          onCerrar={() => setIdSeleccionado(null)}
        />
      )}
    </div>
  );
}
