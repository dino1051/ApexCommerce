import { z } from "zod";

export const articuloSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres."),

  descripcion: z.string(),

  id_categoria: z.coerce
    .number<number>()
    .int("Selecciona una categoría válida.")
    .positive("Debes seleccionar una categoría."),

  precioCompra: z.coerce
    .number<number>()
    .finite("Ingresa un precio válido.")
    .min(0, "El precio de compra no puede ser negativo."),

  precioVenta: z.coerce
    .number<number>()
    .finite("Ingresa un precio válido.")
    .positive("El precio de venta debe ser mayor a cero."),

  stock: z.coerce
    .number<number>()
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),
});

export type ArticuloFormularioEntrada = z.input<typeof articuloSchema>;

export type ArticuloFormulario = z.output<typeof articuloSchema>;
