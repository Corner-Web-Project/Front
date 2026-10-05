import { createContext, useContext, useEffect, useState } from "react"
import { getMyMember, type Member } from "../api/member"

type User = {
  id: string
  name: string
}

type AuthContextType = {
  user: User | null
  login: (accessToken: string, member: Member) => void
  logout: () => void
}

const ACCESS_TOKEN_KEY = "accessToken"

const AuthContext = createContext<AuthContextType | null>(null)

const toUser = (member: Member): User => ({ id: member.studentId, name: member.name })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // 새로고침 시 저장된 토큰으로 로그인 상태 복원 (만료 / 위조된 토큰이면 삭제)
  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!accessToken) return
    getMyMember(accessToken)
      .then((member) => setUser(toUser(member)))
      .catch(() => localStorage.removeItem(ACCESS_TOKEN_KEY))
  }, [])

  const login = (accessToken: string, member: Member) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    setUser(toUser(member))
  }

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
