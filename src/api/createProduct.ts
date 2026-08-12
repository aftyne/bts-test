import apiClient from "@/lib/apiClient"
import type { Product } from "./getProducts"

export interface CreateProductPayload {
  title: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export const createProduct = async (
  payload: CreateProductPayload
): Promise<Product> => {
  const { data } = await apiClient.post<Product>("/products", payload)
  return data
}
