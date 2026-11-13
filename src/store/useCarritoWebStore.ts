import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductoCarritoWeb {
  id: number;
  nombre: string;
  precioVenta: string;
  stock: number;
  cantidad: number;
}

interface CarritoWebState {
  productos: ProductoCarritoWeb[];

  agregarProducto: (producto: Omit<ProductoCarritoWeb, "cantidad">) => void;

  aumentarCantidad: (id: number) => void;
  disminuirCantidad: (id: number) => void;
  eliminarProducto: (id: number) => void;
  vaciarCarrito: () => void;
}

export const useCarritoWebStore = create<CarritoWebState>()(
  persist(
    (set) => ({
      productos: [],

      agregarProducto: (producto) =>
        set((state) => {
          const existente = state.productos.find(
            (item) => item.id === producto.id,
          );

          if (existente) {
            return {
              productos: state.productos.map((item) =>
                item.id === producto.id
                  ? {
                      ...item,
                      stock: producto.stock,
                      precioVenta: producto.precioVenta,
                      cantidad: Math.min(item.cantidad + 1, producto.stock),
                    }
                  : item,
              ),
            };
          }

          if (producto.stock <= 0) {
            return state;
          }

          return {
            productos: [...state.productos, { ...producto, cantidad: 1 }],
          };
        }),

      aumentarCantidad: (id) =>
        set((state) => ({
          productos: state.productos.map((item) =>
            item.id === id
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + 1, item.stock),
                }
              : item,
          ),
        })),

      disminuirCantidad: (id) =>
        set((state) => ({
          productos: state.productos
            .map((item) =>
              item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
            )
            .filter((item) => item.cantidad > 0),
        })),

      eliminarProducto: (id) =>
        set((state) => ({
          productos: state.productos.filter((item) => item.id !== id),
        })),

      vaciarCarrito: () => set({ productos: [] }),
    }),
    {
      name: "apex-commerce-carrito-web",
      partialize: (state) => ({
        productos: state.productos,
      }),
    },
  ),
);
