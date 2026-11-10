import { Link } from "react-router-dom";

export function AdminDashboardPage() {
  return (
    <div className="min-h-screen">
      {/* CABECERA DEL DASHBOARD */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#760009]">
              Operaciones
            </p>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Dashboard
            </h1>

            <p className="text-sm text-[#59413e] mt-1">
              Resumen de la operación del negocio.
            </p>
          </div>

          <Link
            to="/admin/pos"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#991b1b] hover:bg-[#760009] text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[19px]">
              point_of_sale
            </span>
            Abrir POS
          </Link>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiCard
            titulo="Ventas del día"
            valor="--"
            descripcion="Total de ventas POS"
            icono="payments"
          />

          <KpiCard
            titulo="Pedidos pendientes"
            valor="--"
            descripcion="Pedidos por atender"
            icono="local_shipping"
          />

          <KpiCard
            titulo="Stock bajo"
            valor="--"
            descripcion="Productos que requieren atención"
            icono="inventory_2"
          />

          <KpiCard
            titulo="Estado de caja"
            valor="--"
            descripcion="Estado actual"
            icono="account_balance_wallet"
          />
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* VENTAS RECIENTES */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Ventas recientes</h2>

                <p className="text-sm text-[#59413e] mt-0.5">
                  Últimas ventas registradas.
                </p>
              </div>

              <Link
                to="/admin/ventas"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f7f5fa] text-[#59413e] text-[11px] uppercase tracking-wider">
                    <th className="px-5 py-3">Venta</th>

                    <th className="px-5 py-3">Fecha</th>

                    <th className="px-5 py-3">Método</th>

                    <th className="px-5 py-3 text-right">Total</th>

                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <EmptyTableState
                        icono="receipt_long"
                        mensaje="No hay ventas para mostrar."
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] p-5">
            <h2 className="font-bold text-lg">Acciones rápidas</h2>

            <p className="text-sm text-[#59413e] mt-1 mb-4">
              Accede rápidamente a las operaciones principales.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <QuickAction
                ruta="/admin/pos"
                icono="point_of_sale"
                titulo="Nueva venta"
              />

              <QuickAction
                ruta="/admin/productos"
                icono="inventory_2"
                titulo="Productos"
              />

              <QuickAction
                ruta="/admin/pedidos"
                icono="local_shipping"
                titulo="Pedidos"
              />

              <QuickAction
                ruta="/admin/caja"
                icono="account_balance_wallet"
                titulo="Caja"
              />
            </div>
          </div>
        </section>

        {/* PEDIDOS Y STOCK */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* PEDIDOS */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Pedidos recientes</h2>

                <p className="text-sm text-[#59413e]">
                  Pedidos generados desde la tienda.
                </p>
              </div>

              <Link
                to="/admin/pedidos"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver pedidos
              </Link>
            </div>

            <div className="p-5">
              <EmptyState
                icono="local_shipping"
                titulo="Sin pedidos recientes"
                descripcion="Los pedidos de la tienda aparecerán aquí."
              />
            </div>
          </div>

          {/* STOCK */}
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-[#ebe7e6]">
              <div>
                <h2 className="font-bold text-lg">Stock bajo</h2>

                <p className="text-sm text-[#59413e]">
                  Productos con poca disponibilidad.
                </p>
              </div>

              <Link
                to="/admin/productos"
                className="text-xs font-bold text-[#760009] hover:underline"
              >
                Ver catálogo
              </Link>
            </div>

            <div className="p-5">
              <EmptyState
                icono="inventory_2"
                titulo="Sin alertas de stock"
                descripcion="Los productos con stock bajo aparecerán aquí."
              />
            </div>
          </div>
        </section>

        {/* CAJA */}
        <section className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-[#760009]">
                  account_balance_wallet
                </span>
              </div>

              <div>
                <h2 className="font-bold">Caja</h2>

                <p className="text-sm text-[#59413e] mt-0.5">
                  Consulta el estado de la caja y realiza la apertura o cierre.
                </p>
              </div>
            </div>

            <Link
              to="/admin/caja"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#991b1b] text-[#760009] hover:bg-[#fdf0f0] rounded-lg text-sm font-bold transition-colors"
            >
              Administrar caja
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

/* --------------------------------
   COMPONENTES
--------------------------------- */

interface KpiCardProps {
  titulo: string;
  valor: string;
  descripcion: string;
  icono: string;
}

function KpiCard({ titulo, valor, descripcion, icono }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#ebe7e6] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider font-bold text-[#59413e]">
            {titulo}
          </p>

          <p className="text-2xl font-extrabold mt-1">{valor}</p>

          <p className="text-xs text-[#59413e] mt-1">{descripcion}</p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-[#f2f3ff] flex items-center justify-center">
          <span className="material-symbols-outlined text-[#760009]">
            {icono}
          </span>
        </div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  ruta: string;
  icono: string;
  titulo: string;
}

function QuickAction({ ruta, icono, titulo }: QuickActionProps) {
  return (
    <Link
      to={ruta}
      className="p-4 rounded-lg bg-[#f7f5fa] hover:bg-[#efedf5] transition-colors flex flex-col items-center justify-center gap-2 text-center group"
    >
      <span className="material-symbols-outlined text-[#760009] group-hover:scale-110 transition-transform">
        {icono}
      </span>

      <span className="text-xs font-bold">{titulo}</span>
    </Link>
  );
}

interface EmptyStateProps {
  icono: string;
  titulo: string;
  descripcion: string;
}

function EmptyState({ icono, titulo, descripcion }: EmptyStateProps) {
  return (
    <div className="py-8 flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-[#f2f3ff] flex items-center justify-center mb-3">
        <span className="material-symbols-outlined text-[#760009]">
          {icono}
        </span>
      </div>

      <p className="text-sm font-bold">{titulo}</p>

      <p className="text-xs text-[#59413e] mt-1 max-w-sm">{descripcion}</p>
    </div>
  );
}

interface EmptyTableStateProps {
  icono: string;
  mensaje: string;
}

function EmptyTableState({ icono, mensaje }: EmptyTableStateProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="material-symbols-outlined text-3xl text-[#59413e]/50 mb-2">
        {icono}
      </span>

      <p className="text-sm text-[#59413e]">{mensaje}</p>
    </div>
  );
}
