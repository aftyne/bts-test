import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDebounce } from "@/hooks/useDebounce"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchProducts } from "@/api/getProducts"
import { useAuth } from "@/context/AuthContext"
import { CreateProductDialog } from "@/components/CreateProductDialog"
import ProductSkeleton from "@/components/ProductSkeleton"
import { fetchCategories } from "@/api/getCategories"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ProductList() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const limit = 8

  const debouncedSearch = useDebounce(search, 400)
  const offset = (page - 1) * limit

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", offset, debouncedSearch, selectedCategory],
    queryFn: () =>
      fetchProducts(offset, limit, debouncedSearch, selectedCategory),
    placeholderData: keepPreviousData,
  })

  const handleCategoryChange = (val: string | null) => {
    setSelectedCategory(val ?? "all")
    setPage(1)
  }

  const cleanImageUrl = (url?: string) => {
    if (!url) return "https://placehold.co/600x400?text=No+Image"
    const cleaned = url.replace(/^["'[]+|["'\]]+$/g, "")
    return cleaned.startsWith("http")
      ? cleaned
      : "https://placehold.co/600x400?text=Invalid+Image"
  }

  const currentCategory = categories?.find(
    (cat) => String(cat.id) === selectedCategory
  )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <Input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={handleSearchChange}
            className="max-w-xs"
          />

          {/* Category Filter Dropdown */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-45">
              <SelectValue
                placeholder={
                  isLoadingCategories ? "Loading..." : "All Categories"
                }
              >
                {selectedCategory === "all"
                  ? "All Categories"
                  : currentCategory?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {user && <CreateProductDialog />}
      </div>

      {isError && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          Failed to fetch data:{" "}
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: limit }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))
          : data?.map((product) => (
              <Card
                key={product.id}
                className="flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={cleanImageUrl(product.images[0])}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=Image+Error"
                      }}
                    />
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base">
                      {product.title}
                    </CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {product.category?.name || "Uncategorized"}
                    </Badge>
                  </div>
                  <p className="text-lg font-bold text-primary">
                    ${product.price.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {!isLoading && data?.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No products found.
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-medium">{page}</span>
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!data || data.length < limit || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
