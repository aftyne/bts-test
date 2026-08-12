import React, { createContext, useContext, useEffect, useState } from "react"
import {
  fetchUserProfile,
  loginUser,
  type LoginCredentials,
  type UserProfile,
} from "@/api/auth"
import { isAxiosError } from "axios"

interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("access_token")
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const logout = () => {
    localStorage.removeItem("access_token")
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null)
        return
      }
      setIsLoading(true)
      try {
        const profile = await fetchUserProfile(token)
        setUser(profile)
        setError(null)
      } catch {
        logout()
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [token])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const tokens = await loginUser(credentials)
      localStorage.setItem("access_token", tokens.access_token)
      setToken(tokens.access_token)
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.message || "Invalid email or password")
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
