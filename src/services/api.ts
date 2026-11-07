import axios from 'axios'
import { API_URL } from '../config'
import { useAuthStore } from '../store/authStore'
import { authService } from './authService'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// TODO 1.3 (Autenticación): agregue dos interceptores a 'api'.
// a) De petición: si hay accessToken en el store, enviarlo en Authorization: Bearer <token>.
// b) De respuesta: ante un 401 (token vencido) intente UNA sola vez renovar con authService.refresh,
//    guarde los tokens nuevos con setTokens y repita la petición original. Si la renovación falla,
//    llame a logout() y lleve al usuario a /login.

// a) Petición: envía el token si existe
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// b) Respuesta: ante 401 renueva una sola vez y repite la petición
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      try {
        const { refreshToken } = useAuthStore.getState()
        if (!refreshToken) throw new Error('sin refreshToken')
        const tokens = await authService.refresh(refreshToken)
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken)
        original.headers.Authorization = `Bearer ${tokens.accessToken}`
        return api(original)
      } catch {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)
