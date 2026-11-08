import { useEffect, useState } from "react"
import { getMyMember, type Member } from "../api/member"
import { AuthContext } from "./auth"

type User = {
  memberId: number
  id: string
  name: string
  role: Member["role"]
}

const ACCESS_TOKEN_KEY = "accessToken"

const toUser = (member: Member): User => ({
  memberId: member.memberId,
  id: member.studentId,
  name: member.name,
  role: member.role,
})

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
