import { z } from "zod";

export const registroSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(60, "El nombre es demasiado largo."),

    apellido: z
      .string()
      .trim()
      .min(2, "El apellido debe tener al menos 2 caracteres.")
      .max(60, "El apellido es demasiado largo."),

    email: z.string().trim().email("Ingresa un correo electrónico válido."),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(/[A-Z]/, "Debe contener una letra mayúscula.")
      .regex(/[a-z]/, "Debe contener una letra minúscula.")
      .regex(/[0-9]/, "Debe contener al menos un número."),

    confirmarPassword: z.string().min(1, "Confirma tu contraseña."),
  })
  .refine((datos) => datos.password === datos.confirmarPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarPassword"],
  });

export type RegistroFormulario = z.infer<typeof registroSchema>;
