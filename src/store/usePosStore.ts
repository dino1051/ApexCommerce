import { create } from "zustand";
import type { ArticuloPos, ItemCarrito } from "../types/pos";

interface PosState {
  carrito: ItemCarrito[];

  agregarArticulo: (articulo: ArticuloPos) => void;
  aumentarCantidad: (id: number) => void;
  disminuirCantidad: (id: number) => void;
  eliminarArticulo: (id: number) => void;
  vaciarCarrito: () => void;
}

export const usePosStore = create<PosState>()((set) => ({
  carrito: [],

  agregarArticulo: (articulo) =>
    set((state) => {
      if (articulo.stock <= 0) return state;

      const existente = state.carrito.find(
        (item) => item.articulo.id === articulo.id,
      );

      if (existente) {
        return {
          carrito: state.carrito.map((item) =>
            item.articulo.id === articulo.id
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + 1, articulo.stock),
                  articulo,
                }
              : item,
          ),
        };
      }

      return {
        carrito: [...state.carrito, { articulo, cantidad: 1 }],
      };
    }),

  aumentarCantidad: (id) =>
    set((state) => ({
      carrito: state.carrito.map((item) =>
        item.articulo.id === id
          ? {
              ...item,
              cantidad: Math.min(item.cantidad + 1, item.articulo.stock),
            }
          : item,
      ),
    })),

  disminuirCantidad: (id) =>
    set((state) => ({
      carrito: state.carrito
        .map((item) =>
          item.articulo.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    })),

  eliminarArticulo: (id) =>
    set((state) => ({
      carrito: state.carrito.filter((item) => item.articulo.id !== id),
    })),

  vaciarCarrito: () => set({ carrito: [] }),
}));
