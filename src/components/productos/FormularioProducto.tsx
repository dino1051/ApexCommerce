import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, X, Save } from "lucide-react";

import {
  articuloSchema,
  type ArticuloFormulario,
  type ArticuloFormularioEntrada,
} from "../../schemas/articulo.schema";
import type { ArticuloAdmin } from "../../types/articulo";

interface Categoria {
  id: number;
  nombre: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Props {
  producto?: ArticuloAdmin | null;
  categorias: Categoria[];
  guardando: boolean;
  onCerrar: () => void;
  onGuardar: (datos: ArticuloFormulario) => Promise<void>;
}

export function FormularioProducto({
  producto,
  categorias,
  guardando,
  onCerrar,
  onGuardar,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArticuloFormularioEntrada, unknown, ArticuloFormulario>({
    resolver: zodResolver(articuloSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      id_categoria: 0,
      precioCompra: 0,
      precioVenta: 0,
      stock: 0,
    },
  });
  useEffect(() => {
    reset({
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      id_categoria: producto?.id_categoria ?? 0,
      precioCompra: Number(producto?.precioCompra ?? 0),
      precioVenta: Number(producto?.precioVenta ?? 0),
      stock: producto?.stock ?? 0,
    });
  }, [producto, reset]);
  const procesando = guardando || isSubmitting;

  useEffect(() => {
    const cerrarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !procesando) {
        onCerrar();
      }
    };

    window.addEventListener("keydown", cerrarEscape);

    return () => {
      window.removeEventListener("keydown", cerrarEscape);
    };
  }, [onCerrar, procesando]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-formulario-producto"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-800">
              <PackagePlus size={24} />
            </div>

            <div>
              <p className="mt-1 text-sm text-slate-500">
                {producto
                  ? `Modifica los datos de "${producto.nombre}".`
                  : "Registra un artículo en el inventario."}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Registra un artículo en el inventario.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={procesando}
            aria-label="Cerrar formulario"
            className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={21} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onGuardar)}
          className="space-y-6 p-6"
          noValidate
        >
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="mb-2 block text-sm font-semibold"
            >
              Nombre del producto *
            </label>

            <input
              id="nombre"
              type="text"
              placeholder="Ej. Teclado mecánico RGB"
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-800"
            />

            {errors.nombre && (
              <p className="mt-1 text-xs text-red-600">
                {errors.nombre.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="descripcion"
              className="mb-2 block text-sm font-semibold"
            >
              Descripción
            </label>

            <textarea
              id="descripcion"
              rows={3}
              placeholder="Describe las características del artículo..."
              {...register("descripcion")}
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-800"
            />
          </div>

          {/* Categoría */}
          <div>
            <label
              htmlFor="id_categoria"
              className="mb-2 block text-sm font-semibold"
            >
              Categoría *
            </label>

            <select
              id="id_categoria"
              {...register("id_categoria")}
              aria-invalid={!!errors.id_categoria}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 outline-none focus:border-red-800"
            >
              <option value="0">Selecciona una categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>

            {errors.id_categoria && (
              <p className="mt-1 text-xs text-red-600">
                {errors.id_categoria.message}
              </p>
            )}
          </div>

          {/* Precios */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="precioCompra"
                className="mb-2 block text-sm font-semibold"
              >
                Precio de compra *
              </label>

              <input
                id="precioCompra"
                type="number"
                min="0"
                step="0.01"
                {...register("precioCompra")}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-800"
              />

              {errors.precioCompra && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.precioCompra.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="precioVenta"
                className="mb-2 block text-sm font-semibold"
              >
                Precio de venta *
              </label>

              <input
                id="precioVenta"
                type="number"
                min="0.01"
                step="0.01"
                {...register("precioVenta")}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-800"
              />

              {errors.precioVenta && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.precioVenta.message}
                </p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="mb-2 block text-sm font-semibold">
              Stock inicial *
            </label>

            <input
              id="stock"
              type="number"
              min="0"
              step="1"
              {...register("stock")}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-red-800"
            />

            {errors.stock && (
              <p className="mt-1 text-xs text-red-600">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onCerrar}
              disabled={procesando}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={procesando}
              className="flex items-center gap-2 rounded-lg bg-red-800 px-5 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-50"
            >
              <Save size={18} />

              {procesando
                ? "Guardando..."
                : producto
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
