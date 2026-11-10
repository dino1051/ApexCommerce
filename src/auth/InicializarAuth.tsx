import { useEffect } from "react";
import type { ReactNode } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

interface Props {
  children: ReactNode;
}

export function InicializarAuth({ children }: Props) {
  const verificarSesion = useAuthStore((s) => s.verificarSesion);

  const sesionVerificada = useAuthStore((s) => s.sesionVerificada);

  const error = useAuthStore((s) => s.error);

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  if (!sesionVerificada) {
    if (error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4">
          <p className="text-sm text-danger">{error}</p>

          <button
            type="button"
            onClick={() => void verificarSesion()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white"
          >
            <RefreshCw size={17} />
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-canvas">
        <LoaderCircle size={32} className="animate-spin text-primary" />

        <p className="text-sm text-ink-secondary">Verificando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}
