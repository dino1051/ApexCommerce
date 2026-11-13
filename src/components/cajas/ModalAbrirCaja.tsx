import { useState } from "react";
import { X, Wallet, UserRound } from "lucide-react";
import toast from "react-hot-toast";

import { useCajasStore } from "../../store/useCajasStore";

import type { Pos } from "../../types/cajas";

interface ModalAbrirCajaProps {
  terminal: Pos | null;
  onCerrar: () => void;
}

export default function ModalAbrirCaja({
  terminal,
  onCerrar,
}: ModalAbrirCajaProps) {
  const cajeros = useCajasStore((state) => state.cajeros);
  const sesionesAbiertas = useCajasStore((state) => state.sesionesAbiertas);
  const abrirCaja = useCajasStore((state) => state.abrirCaja);
  const procesando = useCajasStore((state) => state.procesando);

  const [idCajero, setIdCajero] = useState("");
  const [montoInicial, setMontoInicial] = useState("500");

  if (!terminal) return null;

  const cajerosOcupados = new Set(
    sesionesAbiertas.map((sesion) => sesion.id_usuario_apertura),
  );

  const cajerosDisponibles = cajeros.filter(
    (cajero) => !cajerosOcupados.has(cajero.id),
  );

  const manejarSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const monto = Number(montoInicial);

    if (!idCajero) {
      toast.error("Selecciona un cajero.");
      return;
    }

    if (!Number.isFinite(monto) || monto <= 0) {
      toast.error("Ingresa un monto inicial válido.");
      return;
    }

    try {
      await abrirCaja({
        id_pos: terminal.id,
        id_cajero: Number(idCajero),
        monto_inicial: monto,
      });

      toast.success("Caja abierta correctamente.");
      setIdCajero("");
      setMontoInicial("500");
      onCerrar();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible abrir la caja.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-abrir-caja"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div>
            <h2
              id="titulo-abrir-caja"
              className="text-xl font-bold text-[#131b2e]"
            >
              Abrir caja #{terminal.numero}
            </h2>

            <p className="mt-1 text-sm text-[#897b78]">
              {terminal.nombre ?? "Terminal POS"}
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={procesando}
            aria-label="Cerrar modal"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={manejarSubmit} className="space-y-5 p-5">
          <div>
            <label
              htmlFor="cajero"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <UserRound size={17} className="text-[#991b1b]" />
              Cajero responsable
            </label>

            <select
              id="cajero"
              value={idCajero}
              onChange={(e) => setIdCajero(e.target.value)}
              required
              className="w-full rounded-lg border border-[#ebe7e6] bg-white px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
            >
              <option value="">Seleccionar cajero</option>

              {cajerosDisponibles.map((cajero) => (
                <option key={cajero.id} value={cajero.id}>
                  {cajero.nombre} {cajero.apellido}
                </option>
              ))}
            </select>

            {cajerosDisponibles.length === 0 && (
              <p className="mt-2 text-xs text-amber-700">
                No hay cajeros disponibles para asignar.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="montoInicial"
              className="mb-2 flex items-center gap-2 text-sm font-semibold"
            >
              <Wallet size={17} className="text-[#991b1b]" />
              Fondo inicial (MXN)
            </label>

            <input
              id="montoInicial"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={montoInicial}
              onChange={(e) => setMontoInicial(e.target.value)}
              className="w-full rounded-lg border border-[#ebe7e6] px-3 py-3 text-sm outline-none focus:border-[#991b1b]"
            />

            <p className="mt-2 text-xs text-[#897b78]">
              Efectivo disponible al iniciar la sesión.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              disabled={procesando}
              className="flex-1 rounded-lg border border-[#ebe7e6] px-4 py-3 font-semibold hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={procesando || cajerosDisponibles.length === 0}
              className="flex-1 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009] disabled:opacity-50"
            >
              {procesando ? "Abriendo..." : "Abrir caja"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
