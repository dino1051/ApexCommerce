import { Pencil, Trash2, Package } from "lucide-react";
import type { ArticuloAdmin } from "../../types/articulo";

interface TablaProductosProps {
  articulos: ArticuloAdmin[];
  onEditar: (articulo: ArticuloAdmin) => void;
  onEliminar: (articulo: ArticuloAdmin) => void;
}

const formatoMoneda = (valor: string | number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(valor));

export function TablaProductos({
  articulos,
  onEditar,
  onEliminar,
}: TablaProductosProps) {
  if (articulos.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <Package className="mx-auto mb-3 text-slate-400" size={36} />
        <p className="font-medium text-slate-700">
          No se encontraron productos
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-5 py-4">Producto</th>
            <th className="px-5 py-4">Categoría</th>
            <th className="px-5 py-4">Stock</th>
            <th className="px-5 py-4">Precio venta</th>
            <th className="px-5 py-4">Precio compra</th>
            <th className="px-5 py-4 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {articulos.map((articulo) => (
            <tr key={articulo.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-800">
                  {articulo.nombre}
                </p>
                <p className="max-w-xs truncate text-xs text-slate-500">
                  {articulo.descripcion || "Sin descripción"}
                </p>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {articulo.categoria?.nombre ?? "Sin categoría"}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    articulo.stock === 0
                      ? "bg-red-100 text-red-700"
                      : articulo.stock <= 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {articulo.stock} unidades
                </span>
              </td>

              <td className="px-5 py-4 font-medium text-slate-800">
                {formatoMoneda(articulo.precioVenta)}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {formatoMoneda(articulo.precioCompra)}
              </td>

              <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEditar(articulo)}
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    aria-label={`Editar ${articulo.nombre}`}
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onEliminar(articulo)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label={`Eliminar ${articulo.nombre}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
