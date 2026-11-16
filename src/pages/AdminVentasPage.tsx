import { useEffect, useMemo, useState } from "react";

import {
  Search,
  RefreshCw,
  ReceiptText,
  Wallet,
  TrendingUp,
  Filter,
} from "lucide-react";

import { useVentasStore } from "../store/useVentasStore";
import { DetalleVentaModal } from "../components/ventas/DetalleVentaModal";

import type { VentaCajero } from "../types/misVentas";
import type { TipoPago } from "../types/pos";

type EstadoVenta = VentaCajero["estado"];

const formatoMoneda = (valor: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

const formatoFecha = (fecha: string) =>
  new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(new Date(fecha));

const nombresPago: Record<TipoPago, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIAQR: "Transferencia QR",
};

const nombresEstado: Record<EstadoVenta, string> = {
  COMPLETADA: "Completada",
  CANCELADA: "Cancelada",
  DEVUELTA: "Devuelta",
  DEVUELTA_PARCIAL: "Devuelta parcial",
};

const estilosEstado: Record<EstadoVenta, string> = {
  COMPLETADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
  DEVUELTA: "bg-slate-100 text-slate-700",
  DEVUELTA_PARCIAL: "bg-amber-100 text-amber-700",
};

const fechaLocal = (fecha: string) => {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(fecha));

  const obtener = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return [obtener("year"), obtener("month"), obtener("day")].join("-");
};

export default function AdminVentasPage() {
  const ventas = useVentasStore((s) => s.ventas);
  const cargando = useVentasStore((s) => s.cargando);
  const error = useVentasStore((s) => s.error);
  const cargarVentas = useVentasStore((s) => s.cargarVentas);

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [ventaSeleccionada, setVentaSeleccionada] =
    useState<VentaCajero | null>(null);

  useEffect(() => {
    void cargarVentas().catch(() => {});
  }, [cargarVentas]);

  const ventasFiltradas = useMemo(() => {
    const termino = busqueda.trim().replace("#", "");

    return ventas
      .filter((venta) => {
        const coincideBusqueda = !termino || String(venta.id).includes(termino);

        const coincideEstado = !estado || venta.estado === estado;

        const coincidePago = !metodoPago || venta.tipo_pago === metodoPago;

        const fecha = fechaLocal(venta.fecha);

        const coincideInicio = !fechaInicio || fecha >= fechaInicio;

        const coincideFin = !fechaFin || fecha <= fechaFin;

        return (
          coincideBusqueda &&
          coincideEstado &&
          coincidePago &&
          coincideInicio &&
          coincideFin
        );
      })
      .sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
  }, [ventas, busqueda, estado, metodoPago, fechaInicio, fechaFin]);

  const resumen = useMemo(() => {
    const completadas = ventasFiltradas.filter(
      (venta) => venta.estado === "COMPLETADA",
    );

    const totalCompletadas = completadas.reduce(
      (total, venta) => total + Number(venta.total),
      0,
    );

    return {
      totalCompletadas,
      cantidad: ventasFiltradas.length,
      completadas: completadas.length,
      promedio:
        completadas.length > 0 ? totalCompletadas / completadas.length : 0,
    };
  }, [ventasFiltradas]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstado("");
    setMetodoPago("");
    setFechaInicio("");
    setFechaFin("");
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#131b2e]">Ventas</h1>

          <p className="mt-1 text-sm text-[#897b78]">
            Consulta las ventas realizadas desde el punto de venta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarVentas().catch(() => {})}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#131b2e] hover:bg-[#faf8ff] disabled:opacity-50"
        >
          <RefreshCw size={18} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#897b78]">
            <Wallet size={19} className="text-[#991b1b]" />
            Total completadas
          </div>

          <p className="text-2xl font-bold text-[#131b2e]">
            {formatoMoneda(resumen.totalCompletadas)}
          </p>
        </div>

        <div className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#897b78]">
            <ReceiptText size={19} className="text-[#991b1b]" />
            Ventas registradas
          </div>

          <p className="text-2xl font-bold text-[#131b2e]">
            {resumen.cantidad}
          </p>

          <p className="mt-1 text-xs text-[#897b78]">
            {resumen.completadas} completadas
          </p>
        </div>

        <div className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-sm text-[#897b78]">
            <TrendingUp size={19} className="text-[#991b1b]" />
            Ticket promedio
          </div>

          <p className="text-2xl font-bold text-[#131b2e]">
            {formatoMoneda(resumen.promedio)}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <section className="rounded-xl border border-[#ebe7e6] bg-white p-4">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-[#991b1b]" />

          <h2 className="font-semibold text-[#131b2e]">Filtros</h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ID..."
              className="w-full rounded-lg border border-[#ebe7e6] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="">Todos los estados</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="DEVUELTA">Devuelta</option>
            <option value="DEVUELTA_PARCIAL">Devuelta parcial</option>
          </select>

          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="">Todos los métodos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIAQR">Transferencia QR</option>
          </select>

          <button
            type="button"
            onClick={limpiarFiltros}
            className="rounded-lg border border-[#ebe7e6] px-4 py-2.5 text-sm font-semibold hover:bg-[#faf8ff]"
          >
            Limpiar filtros
          </button>

          <div>
            <label
              htmlFor="fechaInicio"
              className="mb-1 block text-xs font-semibold text-[#897b78]"
            >
              Desde
            </label>

            <input
              id="fechaInicio"
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full rounded-lg border border-[#ebe7e6] px-3 py-2.5 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <div>
            <label
              htmlFor="fechaFin"
              className="mb-1 block text-xs font-semibold text-[#897b78]"
            >
              Hasta
            </label>

            <input
              id="fechaFin"
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full rounded-lg border border-[#ebe7e6] px-3 py-2.5 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>
        </div>
      </section>

      {/* Errores */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tabla */}
      <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
        <div className="border-b border-[#ebe7e6] px-5 py-4">
          <h2 className="font-bold text-[#131b2e]">Historial de ventas</h2>

          <p className="mt-1 text-xs text-[#897b78]">
            {ventasFiltradas.length} resultados
          </p>
        </div>

        {cargando && ventas.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#897b78]">
            Cargando ventas...
          </div>
        ) : error && ventas.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#897b78]">
            No fue posible cargar las ventas.
          </div>
        ) : ventasFiltradas.length === 0 ? (
          <div className="p-10 text-center text-sm text-[#897b78]">
            No se encontraron ventas con estos filtros.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf8ff] text-xs uppercase text-[#897b78]">
                <tr>
                  <th className="px-5 py-4">Venta</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Método de pago</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#ebe7e6]">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-[#faf8ff]">
                    <td className="px-5 py-4 font-bold text-[#131b2e]">
                      #{venta.id}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[#766b69]">
                      {formatoFecha(venta.fecha)}
                    </td>

                    <td className="px-5 py-4 text-[#131b2e]">
                      {nombresPago[venta.tipo_pago]}
                    </td>

                    <td className="px-5 py-4 font-semibold text-[#131b2e]">
                      {formatoMoneda(venta.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          estilosEstado[venta.estado]
                        }`}
                      >
                        {nombresEstado[venta.estado]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reutilizamos tu modal existente */}
      <DetalleVentaModal
        venta={ventaSeleccionada}
        onCerrar={() => setVentaSeleccionada(null)}
      />
    </div>
  );
}
