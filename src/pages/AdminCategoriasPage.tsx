import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  Search,
  RefreshCw,
  FolderOpen,
  CalendarDays,
  Layers,
} from "lucide-react";

import toast from "react-hot-toast";

import { useCategoriasStore } from "../store/useCategoriasStore";
import { FormularioCategoria } from "../components/categorias/FormularioCategoria";
import type { CategoriaFormulario } from "../schemas/categoria.schema";

const formatearFecha = (fecha: string) => {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
  }).format(new Date(fecha));
};

export default function AdminCategoriasPage() {
  const categorias = useCategoriasStore((state) => state.categorias);

  const cargando = useCategoriasStore((state) => state.cargando);

  const guardando = useCategoriasStore((state) => state.guardando);

  const error = useCategoriasStore((state) => state.error);

  const cargarCategorias = useCategoriasStore(
    (state) => state.cargarCategorias,
  );

  const crearCategoria = useCategoriasStore((state) => state.crearCategoria);

  const limpiarError = useCategoriasStore((state) => state.limpiarError);

  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    void cargarCategorias().catch(() => {});
  }, [cargarCategorias]);

  const categoriasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLocaleLowerCase("es");

    return categorias.filter((categoria) =>
      categoria.nombre.toLocaleLowerCase("es").includes(termino),
    );
  }, [categorias, busqueda]);

  const abrirModal = () => {
    limpiarError();
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;

    setModalAbierto(false);
  };

  const manejarCrear = async (datos: CategoriaFormulario) => {
    // Evita nombres duplicados dentro de la lista
    // actualmente cargada.
    const existe = categorias.some(
      (categoria) =>
        categoria.nombre.trim().toLocaleLowerCase("es") ===
        datos.nombre.trim().toLocaleLowerCase("es"),
    );

    if (existe) {
      toast.error("Esta categoría ya existe.");
      return;
    }

    try {
      await crearCategoria(datos);

      toast.success("Categoría creada correctamente.");

      setModalAbierto(false);
    } catch {
      toast.error("No fue posible crear la categoría.");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorías</h1>

          <p className="mt-1 text-sm text-slate-500">
            Organiza y administra las categorías de tu inventario.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirModal}
          className="flex items-center gap-2 rounded-lg bg-[#991b1b] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#7f1d1d]"
        >
          <Plus size={18} />
          Nueva categoría
        </button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-xl bg-red-50 p-3 text-[#991b1b]">
            <Layers size={25} />
          </div>

          <div>
            <p className="text-sm text-slate-500">Total de categorías</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {categorias.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
            <Search size={25} />
          </div>

          <div>
            <p className="text-sm text-slate-500">Resultados de búsqueda</p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {categoriasFiltradas.length}
            </p>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar categorías..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-red-700"
            />
          </div>

          <button
            type="button"
            onClick={() => void cargarCategorias().catch(() => {})}
            disabled={cargando}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} className={cargando ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-900">Categorías registradas</h2>

          <p className="mt-1 text-xs text-slate-500">
            {categoriasFiltradas.length} resultados
          </p>
        </div>

        {cargando && categorias.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            Cargando categorías...
          </div>
        ) : error && categorias.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">
            No fue posible mostrar las categorías.
          </div>
        ) : categoriasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FolderOpen size={44} className="text-slate-300" />

            <h3 className="font-semibold text-slate-800">
              No se encontraron categorías
            </h3>

            <p className="text-sm text-slate-500">
              {busqueda
                ? "Prueba con otro término de búsqueda."
                : "Comienza registrando una categoría."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">ID</th>

                  <th className="px-5 py-4 font-semibold">Categoría</th>

                  <th className="px-5 py-4 font-semibold">Fecha de creación</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {categoriasFiltradas.map((categoria) => (
                  <tr key={categoria.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-500">
                      #{categoria.id}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-red-50 p-2 text-[#991b1b]">
                          <FolderOpen size={19} />
                        </div>

                        <span className="font-semibold text-slate-900">
                          {categoria.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays size={16} />
                        {formatearFecha(categoria.creadoEn)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalAbierto && (
        <FormularioCategoria
          guardando={guardando}
          onCerrar={cerrarModal}
          onGuardar={manejarCrear}
        />
      )}
    </div>
  );
}
