import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/errorHandler'

const schema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
type LoginForm = z.infer<typeof schema>

// TODO 1.1 (Autenticación): conecte este formulario.
//  - React Hook Form + Zod: ambos campos obligatorios (useForm con zodResolver), mensaje bajo cada campo.
//  - Al enviar: authService.login, guardar la sesión con setSession y navegar a /productos.
//  - Si falla (por ejemplo 400 con credenciales incorrectas), mostrar el mensaje con getErrorMessage
//    dentro del <Alert> de abajo. Mientras se envía, el botón debe quedar deshabilitado.
//  - Si ya hay sesión (accessToken), redirigir a /productos con <Navigate>.
function LoginPage() {
  const field =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-600'
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const accessToken = useAuthStore((s) => s.accessToken)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) })

  if (accessToken) return <Navigate to="/productos" replace />

  const onSubmit = async (data: LoginForm) => {
    setServerError(null)
    try {
      const res = await authService.login(data.username, data.password)
      setSession(res)
      navigate('/productos', { replace: true })
    } catch (err) {
      setServerError(getErrorMessage(err))
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
      <form className="mt-4 space-y-3" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username" className="text-sm font-medium">Usuario</label>
          <input id="username" autoComplete="username" className={field} {...register('username')} />
          {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" className={field} {...register('password')} />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>Ingresar</Button>
      </form>
    </main>
  )
}

export default LoginPage
