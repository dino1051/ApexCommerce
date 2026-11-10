import { z } from "zod";

export const articuloSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  descripcion: z.string(),

  stock: z
    .number()
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  precioVenta: z.number().positive("El precio de venta debe ser mayor a 0"),

  precioCompra: z.number().min(0, "El precio de compra no puede ser negativo"),

  id_categoria: z.number().int().positive("Selecciona una categoría"),
});

export type ArticuloFormulario = z.infer<typeof articuloSchema>;
