import { useEffect, useMemo, useState } from "react";
import { ReceiptText, Banknote, RefreshCw, Search, Filter } from "lucide-react";

import { useMisVentasStore } from "../store/useMisVentasStore";

import type { EstadoVenta } from "../types/misVentas";

import type { TipoPago } from "../types/pos";

const formatoMoneda = (valor: number | string) =>
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

const coloresEstado: Record<EstadoVenta, string> = {
  COMPLETADA: "bg-green-50 text-green-700",
  CANCELADA: "bg-red-50 text-red-700",
  DEVUELTA: "bg-gray-100 text-gray-700",
  DEVUELTA_PARCIAL: "bg-amber-50 text-amber-700",
};

export default function CajeroVentasPage() {
  const ventas = useMisVentasStore((state) => state.ventas);
  const cargando = useMisVentasStore((state) => state.cargando);
  const error = useMisVentasStore((state) => state.error);
  const cargarVentas = useMisVentasStore((state) => state.cargarVentas);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [filtroPago, setFiltroPago] = useState("TODOS");

  useEffect(() => {
    void cargarVentas();
  }, [cargarVentas]);

  const ventasFiltradas = useMemo(() => {
    return ventas.filter((venta) => {
      const coincideBusqueda = String(venta.id).includes(busqueda.trim());

      const coincideEstado =
        filtroEstado === "TODOS" || venta.estado === filtroEstado;

      const coincidePago =
        filtroPago === "TODOS" || venta.tipo_pago === filtroPago;

      return coincideBusqueda && coincideEstado && coincidePago;
    });
  }, [ventas, busqueda, filtroEstado, filtroPago]);

  // Solo contamos ventas completadas para el total
  // bruto mostrado. Las devoluciones parciales
  // requieren sus importes devueltos para calcular netos.
  const ventasCompletadas = ventas.filter(
    (venta) => venta.estado === "COMPLETADA",
  );

  const totalVendido = ventasCompletadas.reduce(
    (total, venta) => total + Number(venta.total),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#991b1b]">
            Operaciones
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#131b2e]">Mis ventas</h1>

          <p className="mt-2 text-sm text-[#766b69]">
            Consulta las ventas registradas con tu cuenta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarVentas()}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold text-[#59413e] hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#fff1f2] p-3 text-[#991b1b]">
              <ReceiptText size={23} />
            </div>

            <div>
              <p className="text-sm text-[#766b69]">Ventas registradas</p>

              <p className="text-2xl font-bold text-[#131b2e]">
                {ventas.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#ebe7e6] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-3 text-green-700">
              <Banknote size={23} />
            </div>

            <div>
              <p className="text-sm text-[#766b69]">
                Total de ventas completadas
              </p>

              <p className="text-2xl font-bold text-[#131b2e]">
                {formatoMoneda(totalVendido)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <section className="rounded-xl border border-[#ebe7e6] bg-white p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-[#991b1b]" />

          <h2 className="font-semibold text-[#131b2e]">Buscar y filtrar</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por ID de venta"
              className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODOS">Todos los estados</option>
            <option value="COMPLETADA">Completada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="DEVUELTA">Devuelta</option>
            <option value="DEVUELTA_PARCIAL">Devuelta parcial</option>
          </select>

          <select
            value={filtroPago}
            onChange={(e) => setFiltroPago(e.target.value)}
            aria-label="Filtrar por método de pago"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODOS">Todos los métodos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
            <option value="TRANSFERENCIAQR">Transferencia QR</option>
          </select>
        </div>
      </section>

      {/* Tabla */}
      <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
        <div className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <h2 className="font-bold text-[#131b2e]">Historial de ventas</h2>

          <span className="text-sm text-[#897b78]">
            {ventasFiltradas.length} resultados
          </span>
        </div>

        {cargando && ventas.length === 0 ? (
          <p className="py-12 text-center text-[#766b69]">Cargando ventas...</p>
        ) : error ? (
          <p role="alert" className="p-6 text-center text-red-600">
            {error}
          </p>
        ) : ventasFiltradas.length === 0 ? (
          <div className="py-16 text-center">
            <ReceiptText size={38} className="mx-auto mb-3 text-[#c9bfbd]" />

            <p className="font-semibold text-[#131b2e]">
              No se encontraron ventas
            </p>

            <p className="mt-1 text-sm text-[#897b78]">
              Prueba con otros filtros o registra una venta.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-[#faf8ff] text-xs uppercase text-[#766b69]">
                <tr>
                  <th className="px-5 py-4">Venta</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Método de pago</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0eceb]">
                {ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-[#faf8ff]">
                    <td className="px-5 py-4 font-semibold text-[#991b1b]">
                      #{venta.id}
                    </td>

                    <td className="px-5 py-4 text-[#59413e]">
                      {formatoFecha(venta.fecha)}
                    </td>

                    <td className="px-5 py-4">
                      {nombresPago[venta.tipo_pago]}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          coloresEstado[venta.estado]
                        }`}
                      >
                        {nombresEstado[venta.estado]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-[#131b2e]">
                      {formatoMoneda(venta.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
