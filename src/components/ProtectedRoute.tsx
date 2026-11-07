import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// TODO 1.4 (Autenticación): si NO hay accessToken en el store, redirija a /login con <Navigate>.
// Si hay sesión, muestre las rutas hijas con <Outlet />.
function ProtectedRoute() {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (!accessToken) return <Navigate to="/login" replace />
  return <Outlet />
}

export default ProtectedRoute
