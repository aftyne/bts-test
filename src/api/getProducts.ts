import apiClient from "@/lib/apiClient"

export interface Category {
  id: number
  name: string
  image: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: Category
  images: string[]
}

export const fetchProducts = async (
  offset: number,
  limit: number,
  title?: string,
  categoryId?: string
): Promise<Product[]> => {
  const { data } = await apiClient.get<Product[]>("/products", {
    params: {
      offset,
      limit,
      title: title || undefined,
      categoryId: categoryId && categoryId !== "all" ? categoryId : undefined,
    },
  })
  return data
}
