import { useEffect } from "react";
import { X, PackagePlus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  articuloSchema,
  type ArticuloFormulario,
} from "../../schemas/articulo.schema";

import type { ArticuloAdmin } from "../../types/articulo";
import type { Categoria } from "../../types/categoria";

import { Boton } from "../ui/Boton";

interface FormularioProductoProps {
  abierto: boolean;
  articulo: ArticuloAdmin | null;
  categorias: Categoria[];
  guardando: boolean;
  onCerrar: () => void;
  onGuardar: (datos: ArticuloFormulario) => Promise<void>;
}

const valoresIniciales: ArticuloFormulario = {
  nombre: "",
  descripcion: "",
  stock: 0,
  precioVenta: 0,
  precioCompra: 0,
  id_categoria: 0,
};

export function FormularioProducto({
  abierto,
  articulo,
  categorias,
  guardando,
  onCerrar,
  onGuardar,
}: FormularioProductoProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticuloFormulario>({
    resolver: zodResolver(articuloSchema),
    defaultValues: valoresIniciales,
  });

  useEffect(() => {
    if (!abierto) return;

    if (articulo) {
      reset({
        nombre: articulo.nombre,
        descripcion: articulo.descripcion ?? "",
        stock: articulo.stock,
        precioVenta: Number(articulo.precioVenta),
        precioCompra: Number(articulo.precioCompra),
        id_categoria: articulo.id_categoria,
      });
    } else {
      reset(valoresIniciales);
    }
  }, [articulo, abierto, reset]);

  useEffect(() => {
    if (!abierto) return;

    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !guardando) {
        onCerrar();
      }
    };

    window.addEventListener("keydown", manejarEscape);

    return () => {
      window.removeEventListener("keydown", manejarEscape);
    };
  }, [abierto, guardando, onCerrar]);

  if (!abierto) return null;

  const manejarEnvio = async (datos: ArticuloFormulario) => {
    await onGuardar(datos);
  };

  return (
    <div
      className="
        fixed inset-0 z-50 flex items-center
        justify-center bg-slate-900/45 p-4
      "
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-formulario-producto"
        className="
          w-full max-w-2xl overflow-hidden
          rounded-modal border border-border-ui
          bg-surface shadow-2xl
        "
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-border-ui px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-light p-3 text-primary">
              <PackagePlus size={22} />
            </div>

            <div>
              <h2
                id="titulo-formulario-producto"
                className="font-heading text-xl font-bold text-ink"
              >
                {articulo ? "Editar producto" : "Nuevo producto"}
              </h2>

              <p className="text-sm text-ink-secondary">
                {articulo
                  ? "Modifica la información del artículo."
                  : "Registra un artículo en el inventario."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            disabled={guardando}
            className="rounded p-2 text-ink-secondary hover:bg-surface-muted"
            aria-label="Cerrar formulario"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(manejarEnvio)}
          className="max-h-[75vh] overflow-y-auto"
        >
          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Nombre */}
            <div className="md:col-span-2">
              <label
                htmlFor="nombre-producto"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Nombre del producto
              </label>

              <input
                id="nombre-producto"
                {...register("nombre")}
                placeholder="Ej. Mouse Logitech M185"
                aria-invalid={!!errors.nombre}
                className="
                  w-full rounded border border-border-strong
                  bg-white px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              />

              {errors.nombre && (
                <p className="mt-1 text-xs text-danger">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label
                htmlFor="descripcion-producto"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Descripción
              </label>

              <textarea
                id="descripcion-producto"
                {...register("descripcion")}
                rows={3}
                placeholder="Descripción del producto..."
                className="
                  w-full resize-none rounded border
                  border-border-strong bg-white
                  px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              />
            </div>

            {/* Categoría */}
            <div>
              <label
                htmlFor="categoria-producto"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Categoría
              </label>

              <select
                id="categoria-producto"
                {...register("id_categoria", {
                  valueAsNumber: true,
                })}
                aria-invalid={!!errors.id_categoria}
                className="
                  w-full rounded border border-border-strong
                  bg-white px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              >
                <option value={0}>Selecciona una categoría</option>

                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>

              {errors.id_categoria && (
                <p className="mt-1 text-xs text-danger">
                  {errors.id_categoria.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock-producto"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Stock inicial
              </label>

              <input
                id="stock-producto"
                type="number"
                min={0}
                step={1}
                {...register("stock", {
                  valueAsNumber: true,
                })}
                aria-invalid={!!errors.stock}
                className="
                  w-full rounded border border-border-strong
                  bg-white px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              />

              {errors.stock && (
                <p className="mt-1 text-xs text-danger">
                  {errors.stock.message}
                </p>
              )}
            </div>

            {/* Precio compra */}
            <div>
              <label
                htmlFor="precio-compra"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Precio de compra (MXN)
              </label>

              <input
                id="precio-compra"
                type="number"
                min={0}
                step="0.01"
                {...register("precioCompra", {
                  valueAsNumber: true,
                })}
                aria-invalid={!!errors.precioCompra}
                className="
                  w-full rounded border border-border-strong
                  bg-white px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              />

              {errors.precioCompra && (
                <p className="mt-1 text-xs text-danger">
                  {errors.precioCompra.message}
                </p>
              )}
            </div>

            {/* Precio venta */}
            <div>
              <label
                htmlFor="precio-venta"
                className="mb-2 block text-xs font-semibold text-ink-secondary"
              >
                Precio de venta (MXN)
              </label>

              <input
                id="precio-venta"
                type="number"
                min={0.01}
                step="0.01"
                {...register("precioVenta", {
                  valueAsNumber: true,
                })}
                aria-invalid={!!errors.precioVenta}
                className="
                  w-full rounded border border-border-strong
                  bg-white px-3 py-2.5 text-sm text-ink
                  outline-none focus:border-primary
                "
              />

              {errors.precioVenta && (
                <p className="mt-1 text-xs text-danger">
                  {errors.precioVenta.message}
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 border-t border-border-ui bg-surface-muted px-6 py-4">
            <Boton
              variante="outline"
              type="button"
              onClick={onCerrar}
              disabled={guardando}
            >
              Cancelar
            </Boton>

            <Boton type="submit" disabled={guardando}>
              <Save size={17} />
              {guardando
                ? "Guardando..."
                : articulo
                  ? "Guardar cambios"
                  : "Crear producto"}
            </Boton>
          </div>
        </form>
      </div>
    </div>
  );
}
