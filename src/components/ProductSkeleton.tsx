import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "./ui/card"

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/2 pt-2" />
      </CardContent>
    </Card>
  )
}
