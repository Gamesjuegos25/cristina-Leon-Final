import { api } from './api'
import type { Product, ListFilters, ProductsResponse } from '../types'

export const PAGE_SIZE = 8

export const productService = {
  // TODO 2.1 (Listado): GET /auth/products con params limit=PAGE_SIZE y skip=(page - 1) * PAGE_SIZE.
  // Si hay texto de búsqueda (q), use GET /auth/products/search con el parámetro q.
  list: async ({ page, q }: ListFilters): Promise<ProductsResponse> => {
    const params = { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }
    if (q.trim()) {
      const res = await api.get<ProductsResponse>('/auth/products/search', {
        params: { ...params, q: q.trim() },
      })
      return res.data
    }
    const res = await api.get<ProductsResponse>('/auth/products', { params })
    return res.data
  },

  // TODO 3.1 (Detalle): GET /auth/products/{id}.
  getById: async (id: number): Promise<Product> => {
    const res = await api.get<Product>(`/auth/products/${id}`)
    return res.data
  },

  // TODO 4.3 (Crear): POST /products/add enviando el FormData (multipart/form-data).
  create: async (body: FormData): Promise<Product> => {
    // Se pone multipart/form-data para que axios no convierta el FormData a JSON.
    const res = await api.post<Product>('/products/add', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  // TODO 4.4 (Eliminar): DELETE /products/{id}.
  remove: async (id: number): Promise<Product> => {
    const res = await api.delete<Product>(`/products/${id}`)
    return res.data
  },
}
