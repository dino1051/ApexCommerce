import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { X, Wallet, AlertTriangle } from "lucide-react";

import { cajasService } from "../../services/cajas";
import type { ResumenCaja, SesionCajaAbierta } from "../../types/cajas";

interface ModalCerrarCajaProps {
  sesion: SesionCajaAbierta;
  onCerrar: () => void;
  onCierreExitoso: () => Promise<void>;
}

const moneda = (valor: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(valor);

function obtenerError(error: unknown) {
  if (error instanceof AxiosError) {
    const mensaje = error.response?.data?.message;

    if (typeof mensaje === "string") return mensaje;
    if (Array.isArray(mensaje)) return mensaje.join(", ");
  }

  return "No fue posible realizar la operación.";
}

export default function ModalCerrarCaja({
  sesion,
  onCerrar,
  onCierreExitoso,
}: ModalCerrarCajaProps) {
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [montoContado, setMontoContado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    const cargarResumen = async () => {
      try {
        const datos = await cajasService.obtenerResumen(sesion.id);

        if (activo) {
          setResumen(datos);
          setError(null);
        }
      } catch (error) {
        if (activo) setError(obtenerError(error));
      } finally {
        if (activo) setCargando(false);
      }
    };

    void cargarResumen();

    return () => {
      activo = false;
    };
  }, [sesion.id]);

  const monto = Number(montoContado);

  const montoValido =
    montoContado.trim() !== "" &&
    Number.isFinite(monto) &&
    monto >= 0 &&
    Number.isInteger(monto * 100);

  const diferencia =
    resumen && montoValido ? monto - resumen.efectivo.esperado : null;

  const confirmarCierre = async () => {
    if (!resumen || !montoValido || procesando) return;

    setProcesando(true);

    try {
      const resultado = await cajasService.cerrarCaja(sesion.id, {
        monto_cierre: monto,
      });

      toast.success(
        `Caja cerrada. Diferencia: ${moneda(resultado.arqueo.diferencia)}`,
      );

      await onCierreExitoso();
      onCerrar();
    } catch (error) {
      toast.error(obtenerError(error));
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-cierre"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between border-b border-[#ebe7e6] p-5">
          <div>
            <h2 id="titulo-cierre" className="text-xl font-bold text-[#131b2e]">
              Cerrar caja #{sesion.pos.numero}
            </h2>
            <p className="mt-1 text-sm text-[#897b78]">
              {sesion.usuario.nombre} {sesion.usuario.apellido}
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

        <div className="space-y-5 p-5">
          {cargando ? (
            <p className="py-8 text-center text-[#897b78]">
              Calculando resumen de caja...
            </p>
          ) : error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : resumen ? (
            <>
              <div className="rounded-xl bg-[#faf8ff] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Wallet size={19} className="text-[#991b1b]" />
                  <h3 className="font-bold text-[#131b2e]">
                    Resumen de efectivo
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#766b69]">Fondo inicial</span>
                    <strong>{moneda(resumen.efectivo.montoInicial)}</strong>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#766b69]">Ventas en efectivo</span>
                    <strong>{moneda(resumen.efectivo.ventasEfectivo)}</strong>
                  </div>

                  <div className="flex justify-between border-t border-[#ebe7e6] pt-3">
                    <span className="font-bold">Efectivo esperado</span>
                    <strong className="text-lg text-[#991b1b]">
                      {moneda(resumen.efectivo.esperado)}
                    </strong>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="montoContado"
                  className="mb-2 block text-sm font-semibold"
                >
                  Efectivo contado (MXN)
                </label>

                <input
                  id="montoContado"
                  type="number"
                  min="0"
                  step="0.01"
                  value={montoContado}
                  onChange={(e) => setMontoContado(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-lg border border-[#ebe7e6] px-4 py-3 outline-none focus:border-[#991b1b]"
                />
              </div>

              {diferencia !== null && (
                <div
                  className={`rounded-xl p-4 ${
                    diferencia < 0
                      ? "bg-red-50 text-red-700"
                      : diferencia > 0
                        ? "bg-amber-50 text-amber-800"
                        : "bg-green-50 text-green-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Diferencia</span>
                    <strong className="text-xl">{moneda(diferencia)}</strong>
                  </div>

                  <p className="mt-2 text-xs">
                    {diferencia < 0
                      ? "El efectivo contado es menor al esperado."
                      : diferencia > 0
                        ? "El efectivo contado supera al esperado."
                        : "El efectivo coincide con el esperado."}
                  </p>
                </div>
              )}

              <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                <AlertTriangle size={17} className="shrink-0" />
                <p>
                  Este cálculo aún no contempla retiros, ingresos adicionales ni
                  devoluciones pagadas en efectivo.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onCerrar}
                  disabled={procesando}
                  className="flex-1 rounded-lg border border-[#ebe7e6] px-4 py-3 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void confirmarCierre()}
                  disabled={!montoValido || procesando}
                  className="flex-1 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {procesando ? "Cerrando..." : "Confirmar cierre"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}
