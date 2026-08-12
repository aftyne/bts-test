import apiClient from '@/lib/apiClient'

export interface Category {
  id: number
  name: string
  image: string
}

export const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}