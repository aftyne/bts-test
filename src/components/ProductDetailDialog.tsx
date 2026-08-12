import type { Product } from "@/api/getProducts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface ProductDetailDialogProps {
  product: Product
  cleanImageUrl: (url?: string) => string
}

export function ProductDetailDialog({
  product,
  cleanImageUrl,
}: ProductDetailDialogProps) {
  const [activeImage, setActiveImage] = useState<string>(product.images[0])

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="w-full gap-2">
            View Details
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pe-4">
          <DialogTitle className="line-clamp-1 text-xl">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2 max-h-[85vh] no-scrollbar overflow-y-auto">
          <div className="relative aspect-[1/0.85] w-full overflow-hidden rounded-md border bg-muted">
            <img
              src={cleanImageUrl(activeImage || product.images[0])}
              alt={product.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/600x400?text=Image+Error"
              }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => {
                const cleanedImg = cleanImageUrl(img)
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 bg-muted transition-all ${
                      activeImage === img
                        ? "border-primary"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={cleanedImg}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex items-center justify-between border-y py-3">
            <Badge variant="secondary">
              {product.category?.name || "Uncategorized"}
            </Badge>
            <p className="text-2xl font-bold text-primary-foreground">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Description
            </h4>
            <p className="text-sm leading-relaxed text-foreground/90">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
