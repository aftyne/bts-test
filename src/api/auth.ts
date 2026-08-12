import apiClient from "@/lib/apiClient"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface UserProfile {
  id: number
  email: string
  name: string
  role: string
  avatar: string
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthTokens> => {
  const { data } = await apiClient.post<AuthTokens>(
    "/auth/login",
    credentials
  )
  return data
}

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return data
}
