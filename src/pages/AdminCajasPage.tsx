import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  RefreshCw,
  Monitor,
  LockKeyhole,
  CheckCircle2,
  UserRound,
} from "lucide-react";
import { useCajasStore } from "../store/useCajasStore";
import type { Pos } from "../types/cajas";
import ModalAbrirCaja from "../components/cajas/ModalAbrirCaja";
import ModalCerrarCaja from "../components/cajas/ModalCerrarCaja";
import type { SesionCajaAbierta } from "../types/cajas";

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

export default function AdminCajasPage() {
  const terminales = useCajasStore((state) => state.terminales);
  const sesionesAbiertas = useCajasStore((state) => state.sesionesAbiertas);
  const cargando = useCajasStore((state) => state.cargando);
  const error = useCajasStore((state) => state.error);
  const cargarDatos = useCajasStore((state) => state.cargarDatos);

  const [terminalSeleccionada, setTerminalSeleccionada] = useState<Pos | null>(
    null,
  );
  const [sesionSeleccionada, setSesionSeleccionada] =
    useState<SesionCajaAbierta | null>(null);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  const cajasDisponibles = useMemo(() => {
    return terminales.filter(
      (terminal) =>
        terminal.activo &&
        !sesionesAbiertas.some((sesion) => sesion.id_pos === terminal.id),
    ).length;
  }, [terminales, sesionesAbiertas]);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#991b1b]">
            Administración
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#131b2e]">
            Administración de cajas
          </h1>

          <p className="mt-2 text-sm text-[#766b69]">
            Gestiona las terminales y sesiones de caja.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void cargarDatos()}
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
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            titulo: "Total de cajas",
            valor: terminales.length,
            icono: Monitor,
          },
          {
            titulo: "Sesiones abiertas",
            valor: sesionesAbiertas.length,
            icono: Wallet,
          },
          {
            titulo: "Cajas disponibles",
            valor: cajasDisponibles,
            icono: CheckCircle2,
          },
        ].map((item) => {
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

      {/* Terminales */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-[#131b2e]">
          Terminales registradas
        </h2>

        {cargando && terminales.length === 0 ? (
          <p className="py-10 text-center text-[#766b69]">
            Cargando terminales...
          </p>
        ) : terminales.length === 0 ? (
          <p className="rounded-xl border border-[#ebe7e6] bg-white p-10 text-center text-[#766b69]">
            No hay terminales registradas.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {terminales.map((terminal) => {
              const sesion = sesionesAbiertas.find(
                (sesion) => sesion.id_pos === terminal.id,
              );

              const disponible = terminal.activo && !sesion;

              return (
                <article
                  key={terminal.id}
                  className="rounded-xl border border-[#ebe7e6] bg-white p-5"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#fff1f2] p-3 text-[#991b1b]">
                        <Monitor size={22} />
                      </div>

                      <div>
                        <h3 className="font-bold text-[#131b2e]">
                          Caja #{terminal.numero}
                        </h3>

                        <p className="mt-1 text-xs text-[#897b78]">
                          {terminal.nombre ?? "Terminal POS"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        !terminal.activo
                          ? "bg-gray-100 text-gray-600"
                          : sesion
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {!terminal.activo
                        ? "Inactiva"
                        : sesion
                          ? "Abierta"
                          : "Disponible"}
                    </span>
                  </div>

                  {sesion ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <UserRound size={16} className="text-[#991b1b]" />

                        <span>
                          {sesion.usuario.nombre} {sesion.usuario.apellido}
                        </span>
                      </div>

                      <p className="text-sm text-[#766b69]">
                        Apertura: {formatoFecha(sesion.fecha_apertura)}
                      </p>

                      <p className="text-sm text-[#766b69]">
                        Fondo inicial:{" "}
                        <strong className="text-[#131b2e]">
                          {formatoMoneda(sesion.monto_inicial)}
                        </strong>
                      </p>

                      <div className="rounded-lg bg-green-50 px-3 py-3 text-center text-sm font-semibold text-green-700">
                        Sesión activa
                      </div>
                      <button
                        type="button"
                        onClick={() => setSesionSeleccionada(sesion)}
                        className="w-full rounded-lg border border-[#991b1b] px-4 py-3 font-semibold text-[#991b1b] transition-colors hover:bg-[#fff1f2]"
                      >
                        Cerrar caja
                      </button>
                    </div>
                  ) : disponible ? (
                    <button
                      type="button"
                      onClick={() => setTerminalSeleccionada(terminal)}
                      className="w-full rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009]"
                    >
                      Abrir caja
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
                      <LockKeyhole size={16} />
                      Terminal inactiva
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <ModalAbrirCaja
        terminal={terminalSeleccionada}
        onCerrar={() => setTerminalSeleccionada(null)}
      />
      {sesionSeleccionada && (
        <ModalCerrarCaja
          sesion={sesionSeleccionada}
          onCerrar={() => setSesionSeleccionada(null)}
          onCierreExitoso={cargarDatos}
        />
      )}
    </div>
  );
}
