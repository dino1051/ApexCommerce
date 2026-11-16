import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FolderPlus, Save, X, LoaderCircle } from "lucide-react";

import {
  categoriaSchema,
  type CategoriaFormulario,
} from "../../schemas/categoria.schema";

interface Props {
  guardando: boolean;
  onCerrar: () => void;
  onGuardar: (datos: CategoriaFormulario) => Promise<void>;
}

export function FormularioCategoria({ guardando, onCerrar, onGuardar }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoriaFormulario>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: "",
    },
  });

  const procesando = guardando || isSubmitting;

  useEffect(() => {
    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !procesando) {
        onCerrar();
      }
    };

    window.addEventListener("keydown", manejarEscape);

    return () => {
      window.removeEventListener("keydown", manejarEscape);
    };
  }, [onCerrar, procesando]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-categoria"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        {/* Encabezado */}
        <header className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-800">
              <FolderPlus size={24} />
            </div>

            <div>
              <h2
                id="titulo-categoria"
                className="text-xl font-bold text-slate-900"
              >
                Nueva categoría
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Organiza los productos de tu inventario.
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
        </header>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onGuardar)}
          noValidate
          className="space-y-6 p-6"
        >
          <div>
            <label
              htmlFor="nombreCategoria"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Nombre de la categoría *
            </label>

            <input
              id="nombreCategoria"
              type="text"
              autoFocus
              placeholder="Ej. Electrónica"
              aria-invalid={!!errors.nombre}
              {...register("nombre")}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition-colors focus:border-red-800"
            />

            {errors.nombre && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {errors.nombre.message}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              Utiliza un nombre claro para identificar los artículos de esta
              categoría.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onCerrar}
              disabled={procesando}
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={procesando}
              className="flex items-center gap-2 rounded-lg bg-[#991b1b] px-5 py-3 text-sm font-semibold text-white hover:bg-[#7f1d1d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {procesando ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}

              {procesando ? "Guardando..." : "Crear categoría"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
