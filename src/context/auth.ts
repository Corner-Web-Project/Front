import { createContext, useContext } from "react"

type AuthContextType = {
  user: { id: string } | null
  login: (id: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
