export interface RespuestaApi<T> {
  success: boolean;
  message?: string;
  data: T;
}

export type DecimalAPI = string | number;
export type FechaAPI = string;
