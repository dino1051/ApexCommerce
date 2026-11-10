import type { ButtonHTMLAttributes, ReactNode } from "react";

type VarianteBoton = "primary" | "secondary" | "outline";

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBoton;
  children: ReactNode;
}

const variantes: Record<VarianteBoton, string> = {
  primary: "bg-primary text-white border-primary-dark hover:bg-primary-hover",
  secondary:
    "bg-secondary text-white border-secondary hover:bg-secondary-hover",
  outline: "bg-surface text-ink border-border-ui hover:bg-surface-muted",
};

export function Boton({
  variante = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: BotonProps) {
  return (
    <button
      type={type}
      className={`
        inline-flex min-h-10 items-center
        justify-center gap-2 rounded
        border px-4 py-2 text-sm font-semibold
        transition-all duration-150
        active:scale-[0.98]
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary
        disabled:opacity-50
        ${variantes[variante]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
