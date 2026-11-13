import { useEffect, useMemo, useState } from "react";
import {
  History,
  RefreshCw,
  Search,
  Wallet,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { useHistorialCajasStore } from "../store/useHistorialCajasStore";
import DetalleSesionModal from "../components/cajas/DetalleSesionModal";

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

export default function HistorialCajasPage() {
  const sesiones = useHistorialCajasStore((state) => state.sesiones);
  const cargando = useHistorialCajasStore((state) => state.cargando);
  const error = useHistorialCajasStore((state) => state.error);
  const cargarHistorial = useHistorialCajasStore(
    (state) => state.cargarHistorial,
  );

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("TODAS");
  const [idSesionSeleccionada, setIdSesionSeleccionada] = useState<
    number | null
  >(null);
  useEffect(() => {
    void cargarHistorial();
  }, [cargarHistorial]);

  const sesionesFiltradas = useMemo(() => {
    return sesiones.filter((sesion) => {
      const coincideBusqueda =
        String(sesion.pos.numero).includes(busqueda.trim()) ||
        `${sesion.usuario.nombre} ${sesion.usuario.apellido}`
          .toLowerCase()
          .includes(busqueda.toLowerCase().trim());

      const coincideEstado = estado === "TODAS" || sesion.estado === estado;

      return coincideBusqueda && coincideEstado;
    });
  }, [sesiones, busqueda, estado]);

  const abiertas = sesiones.filter(
    (sesion) => sesion.estado === "ABIERTA",
  ).length;

  const cerradas = sesiones.filter(
    (sesion) => sesion.estado === "CERRADA",
  ).length;

  const estadisticas = [
    {
      titulo: "Total de sesiones",
      valor: sesiones.length,
      icono: History,
    },
    {
      titulo: "Sesiones abiertas",
      valor: abiertas,
      icono: Clock3,
    },
    {
      titulo: "Sesiones cerradas",
      valor: cerradas,
      icono: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#991b1b]">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#131b2e]">
            Historial de cajas
          </h1>

          <p className="mt-2 text-sm text-[#766b69]">
            Consulta las sesiones de caja registradas.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarHistorial()}
          disabled={cargando}
          className="flex items-center gap-2 rounded-lg border border-[#ebe7e6] bg-white px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
          Actualizar
        </button>
      </header>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-3">
        {estadisticas.map((item) => {
          const Icono = item.icono;

          return (
            <div
              key={item.titulo}
              className="rounded-xl border border-[#ebe7e6] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#fff1f2] p-3 text-[#991b1b]">
                  <Icono size={23} />
                </div>

                <div>
                  <p className="text-sm text-[#766b69]">{item.titulo}</p>

                  <p className="text-2xl font-bold text-[#131b2e]">
                    {item.valor}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros */}
      <section className="rounded-xl border border-[#ebe7e6] bg-white p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar caja o cajero..."
              className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none focus:border-[#991b1b]"
            />
          </div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            aria-label="Filtrar sesiones por estado"
            className="rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
          >
            <option value="TODAS">Todas las sesiones</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="CERRADA">Cerradas</option>
          </select>
        </div>
      </section>

      {/* Tabla */}
      <section className="overflow-hidden rounded-xl border border-[#ebe7e6] bg-white">
        <div className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div className="flex items-center gap-2">
            <Wallet size={19} className="text-[#991b1b]" />

            <h2 className="font-bold text-[#131b2e]">Sesiones registradas</h2>
          </div>

          <span className="text-sm text-[#897b78]">
            {sesionesFiltradas.length} resultados
          </span>
        </div>

        {cargando && sesiones.length === 0 ? (
          <p className="py-12 text-center text-[#897b78]">
            Cargando historial...
          </p>
        ) : error ? (
          <p role="alert" className="p-6 text-center text-red-600">
            {error}
          </p>
        ) : sesionesFiltradas.length === 0 ? (
          <p className="py-12 text-center text-[#897b78]">
            No se encontraron sesiones.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[#faf8ff] text-xs uppercase text-[#766b69]">
                <tr>
                  <th className="px-5 py-4">Sesión</th>
                  <th className="px-5 py-4">Caja</th>
                  <th className="px-5 py-4">Cajero</th>
                  <th className="px-5 py-4">Apertura</th>
                  <th className="px-5 py-4">Cierre</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4 text-right">Monto contado</th>
                  <th className="px-5 py-4 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0eceb]">
                {sesionesFiltradas.map((sesion) => (
                  <tr key={sesion.id} className="hover:bg-[#faf8ff]">
                    <td className="px-5 py-4 font-semibold text-[#991b1b]">
                      #{sesion.id}
                    </td>

                    <td className="px-5 py-4">Caja #{sesion.pos.numero}</td>

                    <td className="px-5 py-4">
                      {sesion.usuario.nombre} {sesion.usuario.apellido}
                    </td>

                    <td className="px-5 py-4">
                      {fecha(sesion.fecha_apertura)}
                    </td>

                    <td className="px-5 py-4">
                      {sesion.fecha_cierre
                        ? fecha(sesion.fecha_cierre)
                        : "Pendiente"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          sesion.estado === "ABIERTA"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {sesion.estado === "ABIERTA" ? "Abierta" : "Cerrada"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right font-semibold">
                      {sesion.monto_cierre !== null
                        ? moneda(sesion.monto_cierre)
                        : "Pendiente"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setIdSesionSeleccionada(sesion.id)}
                        className="rounded-lg border border-[#ebe7e6] px-3 py-2 text-xs font-semibold text-[#991b1b] hover:bg-[#fff1f2]"
                      >
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
      {idSesionSeleccionada !== null && (
        <DetalleSesionModal
          idSesion={idSesionSeleccionada}
          onCerrar={() => setIdSesionSeleccionada(null)}
        />
      )}
    </div>
  );
}
