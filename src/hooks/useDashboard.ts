import { useEffect } from "react";

import { useDashboardStore } from "../store/useDashboardStore";

export function useDashboard() {
  const resumen = useDashboardStore((state) => state.resumen);
  const resumenPedidos = useDashboardStore((state) => state.resumenPedidos);
  const sesionesAbiertas = useDashboardStore((state) => state.sesionesAbiertas);

  const cargando = useDashboardStore((state) => state.cargando);
  const error = useDashboardStore((state) => state.error);

  const cargarDashboard = useDashboardStore((state) => state.cargarDashboard);

  useEffect(() => {
    void cargarDashboard();
  }, [cargarDashboard]);

  return {
    resumen,
    resumenPedidos,
    sesionesAbiertas,
    cargando,
    error,
    recargar: cargarDashboard,
  };
}
