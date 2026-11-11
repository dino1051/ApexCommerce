import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-hot-toast";

import { CatalogoArticulos } from "../components/pos/CatalogoArticulos";
import { CarritoVenta } from "../components/pos/CarritoVenta";
import { ModalCobro } from "../components/pos/ModalCobro";

import { posService } from "../services/pos";
import { usePosStore } from "../store/usePosStore";

import type { ArticuloPos, CrearVentaDTO, TipoPago } from "../types/pos";

export default function PosPage() {
  const [articulos, setArticulos] = useState<ArticuloPos[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalCobroAbierto, setModalCobroAbierto] = useState(false);

  const [procesando, setProcesando] = useState(false);

  const carrito = usePosStore((state) => state.carrito);
  const vaciarCarrito = usePosStore((state) => state.vaciarCarrito);

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado + Number(item.articulo.precioVenta) * item.cantidad,
    0,
  );

  const cargarArticulos = async () => {
    try {
      setError(null);

      const resultado = await posService.obtenerArticulos();
      setArticulos(resultado);
    } catch {
      setError("No fue posible cargar los artículos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarArticulos();
  }, []);

  const confirmarVenta = async (tipoPago: TipoPago) => {
    if (procesando || carrito.length === 0) return;

    const venta: CrearVentaDTO = {
      tipo_pago: tipoPago,
      detalles: carrito.map((item) => ({
        id_articulo: item.articulo.id,
        cantidadArticulos: item.cantidad,
      })),
    };

    setProcesando(true);

    try {
      const resultado = await posService.crearVenta(venta);

      toast.success(`Venta registrada: $${Number(resultado.total).toFixed(2)}`);

      vaciarCarrito();
      setModalCobroAbierto(false);

      // Actualizamos el stock después de registrar la venta.
      await cargarArticulos();
    } catch (error) {
      if (error instanceof AxiosError) {
        const mensaje = error.response?.data?.message;

        toast.error(
          typeof mensaje === "string"
            ? mensaje
            : "No fue posible registrar la venta.",
        );
      } else {
        toast.error("Ocurrió un error inesperado.");
      }
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#991b1b]">
          Operaciones
        </p>

        <h1 className="mt-1 text-3xl font-bold text-[#131b2e]">
          POS Mostrador
        </h1>

        <p className="mt-2 text-sm text-[#766b69]">
          Registra ventas y administra el carrito de compra.
        </p>
      </header>

      {cargando ? (
        <p className="py-12 text-center text-[#766b69]">
          Cargando artículos...
        </p>
      ) : error ? (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CatalogoArticulos articulos={articulos} />
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <CarritoVenta
              onCobrar={() => setModalCobroAbierto(true)}
              deshabilitado={procesando}
            />
          </aside>
        </div>
      )}

      <ModalCobro
        abierto={modalCobroAbierto}
        total={total}
        procesando={procesando}
        onCerrar={() => setModalCobroAbierto(false)}
        onConfirmar={confirmarVenta}
      />
    </div>
  );
}
