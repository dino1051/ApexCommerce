import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShoppingBag,
  LoaderCircle,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import axios from "axios";

import {
  registroSchema,
  type RegistroFormulario,
} from "../schemas/registro.schema";

import { registrarUsuario } from "../services/auth";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroFormulario>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      confirmarPassword: "",
    },
  });

  const manejarRegistro = async (datos: RegistroFormulario) => {
    try {
      const { confirmarPassword: _confirmarPassword, ...datosRegistro } = datos;

      void _confirmarPassword;

      await registrarUsuario(datosRegistro);

      toast.success("Cuenta creada correctamente.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const mensaje = error.response?.data?.message;

        if (error.response?.status === 409) {
          toast.error("Ya existe una cuenta con ese correo.");
          return;
        }

        if (typeof mensaje === "string") {
          toast.error(mensaje);
          return;
        }

        if (Array.isArray(mensaje)) {
          toast.error(mensaje.join(", "));
          return;
        }
      }

      toast.error("No fue posible crear la cuenta. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf8ff] px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#991b1b] text-white shadow-lg shadow-red-900/15"
          >
            <ShoppingBag size={28} />
          </Link>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#131b2e]">
            Crea tu cuenta
          </h1>

          <p className="mt-2 text-sm text-[#897b78]">
            Regístrate para comenzar a comprar en Apex Commerce.
          </p>
        </div>

        {/* Tarjeta */}
        <div className="rounded-2xl border border-[#ebe7e6] bg-white p-6 shadow-sm sm:p-8">
          <form
            onSubmit={handleSubmit(manejarRegistro)}
            noValidate
            className="space-y-5"
          >
            {/* Nombre y apellido */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-semibold text-[#131b2e]"
                >
                  Nombre
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
                  />

                  <input
                    id="nombre"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Tu nombre"
                    aria-invalid={!!errors.nombre}
                    {...register("nombre")}
                    className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#991b1b]"
                  />
                </div>

                {errors.nombre && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="mb-2 block text-sm font-semibold text-[#131b2e]"
                >
                  Apellido
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
                  />

                  <input
                    id="apellido"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Tu apellido"
                    aria-invalid={!!errors.apellido}
                    {...register("apellido")}
                    className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#991b1b]"
                  />
                </div>

                {errors.apellido && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            {/* Correo */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-[#131b2e]"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="correo@ejemplo.com"
                  aria-invalid={!!errors.email}
                  {...register("email")}
                  className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#991b1b]"
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#131b2e]"
              >
                Contraseña
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
                />

                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Crea una contraseña"
                  aria-invalid={!!errors.password}
                  {...register("password")}
                  className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-11 text-sm outline-none transition-colors focus:border-[#991b1b]"
                />

                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  aria-label={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#897b78] hover:text-[#991b1b]"
                >
                  {mostrarPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}

              <p className="mt-2 text-xs text-[#897b78]">
                Mínimo 8 caracteres, una mayúscula, una minúscula y un número.
              </p>
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label
                htmlFor="confirmarPassword"
                className="mb-2 block text-sm font-semibold text-[#131b2e]"
              >
                Confirmar contraseña
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#897b78]"
                />

                <input
                  id="confirmarPassword"
                  type={mostrarConfirmacion ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repite tu contraseña"
                  aria-invalid={!!errors.confirmarPassword}
                  {...register("confirmarPassword")}
                  className="w-full rounded-lg border border-[#ebe7e6] py-3 pl-10 pr-11 text-sm outline-none transition-colors focus:border-[#991b1b]"
                />

                <button
                  type="button"
                  onClick={() => setMostrarConfirmacion(!mostrarConfirmacion)}
                  aria-label={
                    mostrarConfirmacion
                      ? "Ocultar confirmación"
                      : "Mostrar confirmación"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#897b78] hover:text-[#991b1b]"
                >
                  {mostrarConfirmacion ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>

              {errors.confirmarPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.confirmarPassword.message}
                </p>
              )}
            </div>

            {/* Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#991b1b] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#760009] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* Ir al login */}
          <div className="mt-6 border-t border-[#ebe7e6] pt-6 text-center">
            <p className="text-sm text-[#59413e]">
              ¿Ya tienes una cuenta?{" "}
              <Link
                to="/login"
                className="font-bold text-[#991b1b] hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#897b78]">
          Apex Commerce · Tu tienda en línea
        </p>
      </div>
    </div>
  );
}
