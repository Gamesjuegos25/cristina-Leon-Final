import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errorHandler'
import { productService } from '../services/productService'
import type { ListFilters } from '../types'

// TODO 2.2 (Listado): useProducts(filters) con useQuery. La queryKey debe incluir los filtros y la
// consulta no debe parpadear al cambiar de página (placeholderData: keepPreviousData).
export function useProducts(filters: ListFilters) {
  const query = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
    placeholderData: keepPreviousData,
  })
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
    refetch: query.refetch,
    isFetching: query.isFetching,
  }
}

// TODO 3.1 (Detalle): useProduct(id) con useQuery; sin reintentos (retry: false) para que un 404 se muestre de inmediato.
export function useProduct(id: number) {
  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
    retry: false,
  })
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as unknown,
  }
}

// TODO 4.3 (Crear): useCreateProduct() con useMutation. Al terminar: toast de éxito y invalidar la lista.
// Si falla: toast de error con getErrorMessage.
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: FormData) => productService.create(body),
    onSuccess: () => {
      toast.success('Producto creado')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

// TODO 4.4 (Eliminar): useDeleteProduct() con useMutation. Mismo patrón que crear.
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productService.remove(id),
    onSuccess: () => {
      toast.success('Producto eliminado')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
