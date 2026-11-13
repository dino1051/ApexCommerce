import type { EstadoPedidoWeb, EstadoPagoWeb } from "../../types/ventasWeb";

interface Props {
  estado: EstadoPedidoWeb | EstadoPagoWeb;
  tipo: "pedido" | "pago";
}

const estilos: Record<string, string> = {
  PENDIENTE: "bg-amber-50 text-amber-700",
  PAGADO: "bg-green-50 text-green-700",
  EN_CAMINO: "bg-blue-50 text-blue-700",
  ENTREGADO: "bg-emerald-50 text-emerald-700",
  CANCELADO: "bg-red-50 text-red-700",
  RECHAZADO: "bg-red-50 text-red-700",
  REEMBOLSADO: "bg-purple-50 text-purple-700",
};

const etiquetas: Record<string, string> = {
  PENDIENTE: "Pendiente",
  PAGADO: "Pagado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  RECHAZADO: "Rechazado",
  REEMBOLSADO: "Reembolsado",
};

export default function EstadoPedidoBadge({ estado, tipo }: Props) {
  return (
    <span
      title={`Estado de ${tipo}: ${etiquetas[estado]}`}
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        estilos[estado] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {etiquetas[estado] ?? estado}
    </span>
  );
}
