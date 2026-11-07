import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import ProductForm from '../components/ProductForm'
import { useProducts, useDeleteProduct } from '../hooks/useProducts'
import { PAGE_SIZE } from '../services/productService'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/errorHandler'

// TODO 2.3 (Listado): la página y la búsqueda deben vivir en la URL (?page=2&q=texto) con useSearchParams.
//  - parsePage: devuelva un entero >= 1; cualquier valor inválido (page=abc, page=-3) es la página 1.
//  - Al buscar (botón Buscar o Enter) escriba q en la URL y vuelva a la página 1; al paginar cambie solo page.
//  - Al recargar la página o compartir el enlace debe verse la misma lista.
function parsePage(raw: string | null): number {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 ? n : 1
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const q = searchParams.get('q') ?? ''
  const [text, setText] = useState(q)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  // TODO 2.2: useProducts({ page, q }) ya devuelve los datos cuando complete el hook.
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({ page, q })
  const remove = useDeleteProduct()
  void isFetching

  const search = (event: React.FormEvent) => {
    event.preventDefault()
    // TODO 2.3: actualice la URL con q=text y sin page.
    const term = text.trim()
    setSearchParams(term ? { q: term } : {})
  }

  const changePage = (n: number) => {
    // TODO 2.3: actualice la URL con page=n conservando q.
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(n))
      return next
    })
  }

  const onDelete = (item: { id: number; title: string }) => {
    // TODO 4.4 (Eliminar): pida confirmación con window.confirm y, si acepta, llame a remove.mutate(item.id).
    if (window.confirm(`¿Eliminar "${item.title}"?`)) remove.mutate(item.id)
  }

    const salir = () => {
    // TODO 1.5 (Autenticación): cierre la sesión con logout() y vaya a /login con navigate.
    logout()
    navigate('/login', { replace: true })
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <>
      <header className="border-b border-slate-200 bg-brand-800 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className="text-lg font-bold">Catálogo de productos</span>
          <div className="flex items-center gap-3 text-sm">
            {user && <span className="hidden sm:inline">{user.firstName} {user.lastName}</span>}
            <Button variant="secondary" size="sm" onClick={salir}>Cerrar sesión</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="q" className="text-sm font-medium">Buscar</label>
            <input id="q" type="search" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <Button type="submit" variant="outline">Buscar</Button>
          <Button type="button" onClick={() => setShowForm(true)}>Nuevo producto</Button>
        </form>

        {isLoading && <p className="mt-8 text-center text-slate-500" role="status">Cargando…</p>}

        {/* TODO 5.2 (Errores): card de error con el mensaje (getErrorMessage) y un botón Reintentar que llame a refetch. */}
        {isError && (
          <Alert variant="destructive" className="mt-6 flex flex-col gap-3">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            <Button variant="outline" size="sm" className="self-start" onClick={() => refetch()}>Reintentar</Button>
          </Alert>
        )}

        {data && data.products.length === 0 && (
          <p className="mt-8 text-center text-slate-500">No hay resultados para la búsqueda.</p>
        )}

        {data && data.products.length > 0 && (
          <>
            <p className="mt-4 text-sm text-slate-500">{data.total} resultados</p>
            {/* TODO 6.1 (Interfaz): la cuadrícula debe tener 1 columna en móvil, 2 en tableta (sm) y 4 en escritorio (lg). */}
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.products.map((item) => (
                <ProductCard key={item.id} item={item} onDelete={onDelete} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </>
        )}
      </main>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </>
  )
}

export default ProductsPage
