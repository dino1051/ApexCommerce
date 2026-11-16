import { z } from "zod";

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
});

export type CategoriaFormulario = z.infer<typeof categoriaSchema>;
