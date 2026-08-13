import { useState, type SubmitEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { createProduct, type CreateProductPayload } from "@/api/createProduct"
import { toast } from "./ui/toast"
import { fetchCategories } from "@/api/getCategories"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60,
  })

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.add({
        type: "success",
        title: "Product Created",
        description: "The new product has been successfully added.",
      })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      resetForm()
      setOpen(false)
    },
    onError: () => {
      toast.add({
        type: "error",
        description: "Error when creating a product.",
        priority: "high",
      })
    },
  })

  const resetForm = () => {
    setTitle("")
    setPrice("")
    setDescription("")
    setCategoryId("1")
    setImageUrl("")
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()

    if (!categoryId) {
      toast.add({
        type: "error",
        title: "Validation Error",
        description: "Please select a category.",
      })
      return
    }

    const payload: CreateProductPayload = {
      title,
      price: Number(price),
      description: description || "A new quality product.",
      categoryId: Number(categoryId),
      images: [
        imageUrl.trim() || "https://placehold.co/600x400?text=Product+Image",
      ],
    }

    mutation.mutate(payload)
  }

  const selectedCategory = categories?.find(
    (cat) => String(cat.id) === categoryId
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Classic Sneakers"
              maxLength={150}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                min="1"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={categoryId}
                onValueChange={(value) => setCategoryId(value ?? "")}
                required
              >
                <SelectTrigger id="category" className={"w-full"}>
                  <SelectValue
                    placeholder={
                      isLoadingCategories ? "LoadinSg..." : "Select category"
                    }
                  >
                    {selectedCategory?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.remote.com/item.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
