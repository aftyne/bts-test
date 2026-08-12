import { useState, type SubmitEvent } from "react"
import { useAuth } from "@/context/AuthContext"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, Loader2 } from "lucide-react"

export function LoginDialog() {
  const { login, isLoading, error } = useAuth()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("john@mail.com")
  const [password, setPassword] = useState("changeme")

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    try {
      await login({ email, password })
      setOpen(false)
    } catch (error) {
      console.error("Login submission failed:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Log In
          </Button>
        }
      />
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Log In to Your Account</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {error && (
            <Alert variant="destructive" className="py-2 text-sm">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p className="rounded bg-muted p-2 text-xs text-muted-foreground">
            <strong>Credentials:</strong>
            <br />
            Email: <code className="text-foreground">john@mail.com</code>
            <br />
            Password: <code className="text-foreground">changeme</code>
          </p>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
