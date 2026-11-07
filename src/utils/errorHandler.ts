import axios from 'axios'

// TODO 5.1 (Errores): convierta cualquier error en un mensaje legible en español.
// Use axios.isAxiosError(error). Sin error.response: 'Sin conexión...'. Con respuesta, según
// error.response.status: 400, 401, 403, 404 (puede usar data.message del servidor) y 500 o más.
// Cualquier otro caso: un mensaje genérico. Se usa en los toasts y en la card de error.
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Sin conexión. Revise su internet e intente de nuevo.'
    const status = error.response.status
    const serverMessage = (error.response.data as { message?: string } | undefined)?.message
    if (status === 400) return serverMessage ?? 'Los datos enviados no son válidos.'
    if (status === 401) return serverMessage ?? 'Su sesión expiró. Inicie sesión de nuevo.'
    if (status === 403) return serverMessage ?? 'No tiene permiso para realizar esta acción.'
    if (status === 404) return serverMessage ?? 'No se encontró lo que buscaba.'
    if (status >= 500) return 'El servidor tuvo un problema. Intente más tarde.'
  }
  return 'Ocurrió un error inesperado. Intente de nuevo.'
}
