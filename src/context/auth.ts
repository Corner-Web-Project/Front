import { createContext, useContext } from "react"
import type { Member } from "../api/member"

type AuthContextType = {
  user: { id: string; name: string; role: Member['role'] } | null
  login: (accessToken: string, member: Member) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}
