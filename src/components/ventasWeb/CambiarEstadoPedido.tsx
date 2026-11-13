import { useState } from "react";
import { Truck, PackageCheck } from "lucide-react";
import toast from "react-hot-toast";

import { useVentasWebStore } from "../../store/useVentasWebStore";
import type { EstadoPedidoWeb, EstadoPagoWeb } from "../../types/ventasWeb";

interface Props {
  idVenta: number;
  estado: EstadoPedidoWeb;
  estadoPago: EstadoPagoWeb;
  onActualizado?: () => void;
}

export default function CambiarEstadoPedido({
  idVenta,
  estado,
  estadoPago,
  onActualizado,
}: Props) {
  const actualizarEstado = useVentasWebStore((state) => state.actualizarEstado);

  const procesando = useVentasWebStore((state) => state.procesando);

  const [confirmando, setConfirmando] = useState(false);

  if (estadoPago !== "PAGADO") {
    return null;
  }

  let siguienteEstado: EstadoPedidoWeb;
  let texto: string;

  if (estado === "PAGADO") {
    siguienteEstado = "EN_CAMINO";
    texto = "Marcar como enviado";
  } else if (estado === "EN_CAMINO") {
    siguienteEstado = "ENTREGADO";
    texto = "Marcar como entregado";
  } else {
    return null;
  }

  const Icono = siguienteEstado === "EN_CAMINO" ? Truck : PackageCheck;

  const confirmarCambio = async () => {
    try {
      await actualizarEstado(idVenta, siguienteEstado);

      toast.success("Estado del pedido actualizado");

      setConfirmando(false);
      onActualizado?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el pedido",
      );
    }
  };

  return (
    <div className="space-y-3">
      {!confirmando ? (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          disabled={procesando}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-4 py-3 font-semibold text-white hover:bg-[#760009] disabled:opacity-50"
        >
          <Icono size={18} />
          {texto}
        </button>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            ¿Confirmar cambio de estado?
          </p>

          <p className="mt-1 text-sm text-amber-800">
            El pedido #{idVenta} cambiará a{" "}
            {siguienteEstado === "EN_CAMINO" ? "En camino" : "Entregado"}.
          </p>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmando(false)}
              disabled={procesando}
              className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => void confirmarCambio()}
              disabled={procesando}
              className="flex-1 rounded-lg bg-[#991b1b] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {procesando ? "Guardando..." : "Confirmar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
