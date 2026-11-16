import { useEffect, useMemo, useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

import { useArticulosStore } from "../store/useArticulosStore";
import { TablaProductos } from "../components/productos/TablaProductos";
import type { ArticuloAdmin } from "../types/articulo";
import { useCategoriasStore } from "../store/useCategoriasStore";
import toast from "react-hot-toast";
import { FormularioProducto } from "../components/productos/FormularioProducto";
import type { ArticuloFormulario } from "../schemas/articulo.schema";

export default function AdminProductosPage() {
  const articulos = useArticulosStore((s) => s.articulos);
  const cargando = useArticulosStore((s) => s.cargando);
  const guardando = useArticulosStore((s) => s.guardando);
  const error = useArticulosStore((s) => s.error);
  const cargarArticulos = useArticulosStore((s) => s.cargarArticulos);
  const eliminarArticulo = useArticulosStore((s) => s.eliminarArticulo);

  const categorias = useCategoriasStore((s) => s.categorias);
  const cargarCategorias = useCategoriasStore((s) => s.cargarCategorias);
  const crearArticulo = useArticulosStore((s) => s.crearArticulo);
  const actualizarArticulo = useArticulosStore((s) => s.actualizarArticulo);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<ArticuloAdmin | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    void cargarArticulos().catch(() => {});
    void cargarCategorias().catch(() => {});
  }, [cargarArticulos, cargarCategorias]);

  const articulosFiltrados = useMemo(() => {
    return articulos.filter((articulo) => {
      const coincideNombre = articulo.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim());

      const coincideCategoria =
        !categoriaId || articulo.id_categoria === Number(categoriaId);

      return coincideNombre && coincideCategoria;
    });
  }, [articulos, busqueda, categoriaId]);

  const abrirCrear = () => {
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };

  const abrirEditar = (articulo: ArticuloAdmin) => {
    setProductoSeleccionado(articulo);
    setModalAbierto(true);
  };
  const manejarCrear = async (datos: ArticuloFormulario) => {
    try {
      await crearArticulo(datos);

      toast.success("Producto creado correctamente");

      setModalAbierto(false);
    } catch {
      toast.error("No fue posible crear el producto");
    }
  };
  const manejarGuardar = async (datos: ArticuloFormulario) => {
    try {
      if (productoSeleccionado) {
        await actualizarArticulo(productoSeleccionado.id, datos);

        toast.success("Producto actualizado correctamente");
      } else {
        await crearArticulo(datos);

        toast.success("Producto creado correctamente");
      }

      setModalAbierto(false);
      setProductoSeleccionado(null);
    } catch {
      toast.error(
        productoSeleccionado
          ? "No fue posible actualizar el producto"
          : "No fue posible crear el producto",
      );
    }
  };
  const manejarEliminar = async (articulo: ArticuloAdmin) => {
    const confirmado = window.confirm(`¿Deseas eliminar "${articulo.nombre}"?`);

    if (!confirmado) return;

    try {
      await eliminarArticulo(articulo.id);
    } catch {
      // El store ya registra el error.
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administra los artículos de tu inventario.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCrear}
          className="flex items-center gap-2 rounded-lg bg-red-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-900"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-red-700"
            />
          </div>

          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-red-700"
          >
            <option value="">Todas las categorías</option>

            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void cargarArticulos().catch(() => {})}
            disabled={cargando}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Actualizar
          </button>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {cargando && articulos.length === 0 ? (
        <p className="text-sm text-slate-500">Cargando productos...</p>
      ) : (
        <TablaProductos
          articulos={articulosFiltrados}
          onEditar={abrirEditar}
          onEliminar={(articulo) => {
            if (!guardando) void manejarEliminar(articulo);
          }}
        />
      )}

      {/* Aquí integraremos FormularioProducto */}
      {modalAbierto && (
        <FormularioProducto
          producto={productoSeleccionado}
          categorias={categorias}
          guardando={guardando}
          onCerrar={() => {
            setModalAbierto(false);
            setProductoSeleccionado(null);
          }}
          onGuardar={manejarGuardar}
        />
      )}
    </div>
  );
}
