import { useEffect, useState } from "react";

import { useDashboardStore } from "../store/useDashboardStore";
import { obtenerPedidosRecientes } from "../services/ventasWeb";
import type { VentaWeb } from "../types/ventasWeb";

export function useDashboard() {
  const resumen = useDashboardStore((state) => state.resumen);
  const resumenPedidos = useDashboardStore((state) => state.resumenPedidos);
  const sesionesAbiertas = useDashboardStore((state) => state.sesionesAbiertas);
  const articulosStockBajo = useDashboardStore(
    (state) => state.articulosStockBajo,
  );
  const cargando = useDashboardStore((state) => state.cargando);
  const error = useDashboardStore((state) => state.error);

  const cargarDashboard = useDashboardStore((state) => state.cargarDashboard);
  const [pedidosRecientes, setPedidosRecientes] = useState<VentaWeb[]>([]);

  const [errorPedidosRecientes, setErrorPedidosRecientes] = useState<
    string | null
  >(null);

  const [cargandoPedidosRecientes, setCargandoPedidosRecientes] =
    useState(false);
  useEffect(() => {
    void cargarDashboard();
    cargarPedidosRecientes();
  }, [cargarDashboard]);

  const cargarPedidosRecientes = async () => {
    setCargandoPedidosRecientes(true);
    setErrorPedidosRecientes(null);

    try {
      const pedidos = await obtenerPedidosRecientes();
      setPedidosRecientes(pedidos);
    } catch {
      setErrorPedidosRecientes("No fue posible cargar los pedidos recientes.");
    } finally {
      setCargandoPedidosRecientes(false);
    }
  };

  return {
    resumen,
    resumenPedidos,
    sesionesAbiertas,
    articulosStockBajo,
    cargando,
    error,
    pedidosRecientes,
    cargandoPedidosRecientes,
    errorPedidosRecientes,
    recargar: cargarDashboard,
  };
}
