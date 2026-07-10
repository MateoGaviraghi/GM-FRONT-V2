/**
 * friendly-errors.ts — Mostrador (A0R). Traduce errores de API/axios a
 * lenguaje simple en español, sin jerga técnica ni códigos HTTP crudos.
 */

export type ApiErrorLike = {
  response?: { status?: number; data?: { message?: string } };
  message?: string;
  code?: string;
};

const DEFAULT_MESSAGE = "No pudimos guardar los cambios. Esperá unos segundos y volvé a intentar.";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Algo de lo que cargaste no es válido. Revisá los campos marcados.",
  401: "Tu sesión venció. Volvé a iniciar sesión para continuar.",
  403: "No tenés permiso para hacer esta acción. Consultá con un administrador.",
  404: "No encontramos lo que buscabas. Puede que ya haya sido eliminado.",
  409: "Ese dato ya existe. Revisá que no esté cargado dos veces.",
  413: "El archivo es demasiado pesado. Probá con uno más liviano.",
  422: "Algo de lo que cargaste no es válido. Revisá los campos marcados.",
  429: "Hiciste demasiados intentos seguidos. Esperá un minuto y volvé a intentar.",
  500: DEFAULT_MESSAGE,
  502: DEFAULT_MESSAGE,
  503: "El sistema no está disponible en este momento. Probá de nuevo en unos minutos.",
  504: "El sistema tardó demasiado en responder. Probá de nuevo en unos minutos.",
};

/** Convierte cualquier error de servicio/axios en un mensaje simple para mostrar al usuario. */
export function mapApiError(error: unknown): string {
  if (!error) return DEFAULT_MESSAGE;
  const err = error as ApiErrorLike;

  if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
    return "No hay conexión a internet. Revisá tu conexión y volvé a intentar.";
  }

  const status = err.response?.status;
  if (status && STATUS_MESSAGES[status]) return STATUS_MESSAGES[status];

  return DEFAULT_MESSAGE;
}
