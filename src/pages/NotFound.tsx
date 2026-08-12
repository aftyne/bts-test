import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4 text-muted-foreground">
            <FileQuestion className="h-12 w-12" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold tracking-tight text-primary">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
          <p className="text-sm text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            render={
              <Link to="/" className="gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            }
          ></Button>
        </div>
      </div>
    </div>
  )
}
