import { useEffect, useState } from "react";
import {
  X,
  Banknote,
  CreditCard,
  QrCode,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

import type { TipoPago } from "../../types/pos";

interface ModalCobroProps {
  abierto: boolean;
  total: number;
  procesando: boolean;
  onCerrar: () => void;
  onConfirmar: (tipoPago: TipoPago) => Promise<void>;
}

const metodosPago: {
  valor: TipoPago;
  nombre: string;
  icono: typeof Banknote;
}[] = [
  {
    valor: "EFECTIVO",
    nombre: "Efectivo",
    icono: Banknote,
  },
  {
    valor: "TARJETA",
    nombre: "Tarjeta",
    icono: CreditCard,
  },
  {
    valor: "TRANSFERENCIAQR",
    nombre: "Transferencia QR",
    icono: QrCode,
  },
];

const formatoMoneda = (valor: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);

export function ModalCobro({
  abierto,
  total,
  procesando,
  onCerrar,
  onConfirmar,
}: ModalCobroProps) {
  const [tipoPago, setTipoPago] = useState<TipoPago>("EFECTIVO");
  const [montoRecibido, setMontoRecibido] = useState("");

  useEffect(() => {
    if (!abierto) {
      setTipoPago("EFECTIVO");
      setMontoRecibido("");
    }
  }, [abierto]);

  if (!abierto) return null;

  const recibido = Number(montoRecibido);
  const cambio = Math.max(0, recibido - total);

  const efectivoValido =
    montoRecibido.trim() !== "" &&
    Number.isFinite(recibido) &&
    recibido >= total;

  const puedeConfirmar =
    !procesando && total > 0 && (tipoPago !== "EFECTIVO" || efectivoValido);

  const manejarConfirmacion = async () => {
    if (!puedeConfirmar) return;

    await onConfirmar(tipoPago);
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-cobro"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="titulo-modal-cobro"
              className="text-xl font-bold text-[#131b2e]"
            >
              Confirmar venta
            </h2>

            <p className="mt-1 text-sm text-[#766b69]">
              Selecciona el método de pago.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={procesando}
            aria-label="Cerrar"
            className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 rounded-xl bg-[#fff1f2] p-5 text-center">
          <p className="text-sm text-[#766b69]">Total a cobrar</p>

          <p className="mt-1 text-3xl font-bold text-[#991b1b]">
            {formatoMoneda(total)}
          </p>
        </div>

        <h3 className="mb-3 text-sm font-semibold">Método de pago</h3>

        <div className="mb-5 grid grid-cols-3 gap-2">
          {metodosPago.map((metodo) => {
            const Icono = metodo.icono;
            const seleccionado = tipoPago === metodo.valor;

            return (
              <button
                key={metodo.valor}
                type="button"
                disabled={procesando}
                onClick={() => setTipoPago(metodo.valor)}
                aria-pressed={seleccionado}
                className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors ${
                  seleccionado
                    ? "border-[#991b1b] bg-[#fff1f2] text-[#991b1b]"
                    : "border-[#ebe7e6] text-[#766b69] hover:bg-gray-50"
                }`}
              >
                <Icono size={23} />
                {metodo.nombre}
              </button>
            );
          })}
        </div>

        {tipoPago === "EFECTIVO" && (
          <div className="mb-5 space-y-3">
            <div>
              <label
                htmlFor="monto-recibido"
                className="mb-2 block text-sm font-semibold"
              >
                Monto recibido
              </label>

              <input
                id="monto-recibido"
                type="number"
                min="0"
                step="0.01"
                value={montoRecibido}
                disabled={procesando}
                onChange={(e) => setMontoRecibido(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-[#ebe7e6] px-4 py-3 outline-none focus:border-[#991b1b]"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <span className="text-sm text-[#766b69]">Cambio a entregar</span>

              <span className="font-bold text-green-700">
                {formatoMoneda(cambio)}
              </span>
            </div>

            {montoRecibido !== "" && !efectivoValido && (
              <p className="text-xs text-red-600">
                El monto recibido debe cubrir el total.
              </p>
            )}
          </div>
        )}

        {tipoPago !== "EFECTIVO" && (
          <div className="mb-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
            Confirma que el pago se haya realizado correctamente antes de
            registrar la venta.
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCerrar}
            disabled={procesando}
            className="flex-1 rounded-lg border border-[#ebe7e6] px-4 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => void manejarConfirmacion()}
            disabled={!puedeConfirmar}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {procesando ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Confirmar
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
