import { useEffect, useState } from "react"
import { useAuth } from "../context/auth"
import { getMembers, updateMemberRole, type Member } from "../api/member"
import {
  deleteJoinApplication,
  getJoinApplication,
  getJoinApplications,
  updateJoinApplicationStatus,
  type JoinApplicationDetail,
  type JoinApplicationSummary,
  type JoinStatus,
} from "../api/join"

type Tab = "members" | "joins"

const ROLE_LABEL: Record<Member["role"], string> = {
  MEMBER: "일반 회원",
  ADMIN: "운영진",
}

const JOIN_STATUS_LABEL: Record<JoinStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "거절",
}

const JOIN_STATUS_STYLE: Record<JoinStatus, string> = {
  PENDING: "bg-[#FEF3C7] text-[#92400E]",
  APPROVED: "bg-[#DCFCE7] text-[#166534]",
  REJECTED: "bg-[#E5E7EB] text-[#4B5563]",
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })

// 관리자 페이지. 실제 권한 검사는 Back API에서 하므로 여기서는 화면 표시만 구분한다
export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>("members")

  if (user?.role !== "ADMIN") {
    return (
      <div className="py-20 text-center text-[#014BAA]">
        관리자만 접근할 수 있는 페이지입니다.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F3F0] text-[#333333] pb-20">
      <main className="max-w-5xl mx-auto px-4 pt-12">
        <h1 className="text-2xl font-medium text-[#014BAA] mb-8">관리자 페이지</h1>

        <div className="flex gap-2 mb-6">
          {([["members", "회원 관리"], ["joins", "가입 신청"]] as [Tab, string][]).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-1.5 rounded-full text-sm transition ${
                tab === value ? "bg-[#3B82F6] text-white" : "bg-[#E5E7EB] text-[#4B5563] hover:bg-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "members" ? <MemberManagement myMemberId={user.memberId} /> : <JoinManagement />}
      </main>
    </div>
  )
}

// 회원 목록과 권한 변경
function MemberManagement({ myMemberId }: { myMemberId: number }) {
  const [result, setResult] = useState<{ members: Member[]; error: string } | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  useEffect(() => {
    let ignore = false
    getMembers()
      .then((members) => {
        if (!ignore) setResult({ members, error: "" })
      })
      .catch((e: Error) => {
        if (!ignore) setResult({ members: [], error: e.message })
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleRoleChange = async (member: Member, role: Member["role"]) => {
    if (!window.confirm(`${member.name}님의 권한을 '${ROLE_LABEL[role]}'(으)로 변경하시겠습니까?`)) return
    setUpdatingId(member.memberId)
    try {
      const updated = await updateMemberRole(member.memberId, role)
      setResult((prev) => prev && {
        ...prev,
        members: prev.members.map((m) => (m.memberId === updated.memberId ? updated : m)),
      })
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setUpdatingId(null)
    }
  }

  if (!result) return <p className="text-sm text-gray-500">불러오는 중...</p>
  if (result.error) return <p className="text-sm text-red-500">{result.error}</p>

  return (
    <section>
      <p className="text-xs text-[#6B7280] mb-3">
        권한 변경은 해당 회원이 다시 로그인하면 반영됩니다. 본인 권한과 마지막 운영진의 권한은 바꿀 수 없습니다.
      </p>
      <table className="w-full text-sm border-t border-gray-300">
        <thead>
          <tr className="text-left text-[#6B7280] border-b border-gray-200">
            <th className="py-2 font-normal">학번</th>
            <th className="py-2 font-normal">이름</th>
            <th className="py-2 font-normal">이메일</th>
            <th className="py-2 font-normal">가입일</th>
            <th className="py-2 font-normal">권한</th>
          </tr>
        </thead>
        <tbody>
          {result.members.map((member) => {
            const isMe = member.memberId === myMemberId
            return (
              <tr key={member.memberId} className="border-b border-gray-100">
                <td className="py-2">{member.studentId}</td>
                <td className="py-2">{member.name}{isMe && <span className="ml-1 text-xs text-[#9CA3AF]">(본인)</span>}</td>
                <td className="py-2">{member.email}</td>
                <td className="py-2">{formatDate(member.createDate)}</td>
                <td className="py-2">
                  <select
                    value={member.role}
                    disabled={isMe || updatingId === member.memberId}
                    onChange={(e) => handleRoleChange(member, e.target.value as Member["role"])}
                    className="border border-gray-300 rounded px-2 py-1 text-sm disabled:opacity-50"
                  >
                    <option value="MEMBER">{ROLE_LABEL.MEMBER}</option>
                    <option value="ADMIN">{ROLE_LABEL.ADMIN}</option>
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

// 가입 신청 목록, 상세 보기, 승인, 삭제
function JoinManagement() {
  const [result, setResult] = useState<{ applications: JoinApplicationSummary[]; error: string } | null>(null)
  const [openedDetail, setOpenedDetail] = useState<JoinApplicationDetail | null>(null)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    let ignore = false
    getJoinApplications()
      .then((applications) => {
        if (!ignore) setResult({ applications, error: "" })
      })
      .catch((e: Error) => {
        if (!ignore) setResult({ applications: [], error: e.message })
      })
    return () => {
      ignore = true
    }
  }, [])

  const handleToggleDetail = async (joinId: number) => {
    if (openedDetail?.joinId === joinId) {
      setOpenedDetail(null)
      return
    }
    try {
      setOpenedDetail(await getJoinApplication(joinId))
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const handleApprove = async (application: JoinApplicationSummary) => {
    if (!window.confirm(`${application.name}님의 가입 신청을 승인하시겠습니까?`)) return
    setProcessingId(application.joinId)
    try {
      const updated = await updateJoinApplicationStatus(application.joinId, "APPROVED")
      setResult((prev) => prev && {
        ...prev,
        applications: prev.applications.map((a) => (a.joinId === updated.joinId ? { ...a, status: updated.status } : a)),
      })
      if (openedDetail?.joinId === updated.joinId) setOpenedDetail(updated)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleDelete = async (application: JoinApplicationSummary) => {
    if (!window.confirm(`${application.name}님의 가입 신청을 삭제하시겠습니까? 삭제하면 되돌릴 수 없습니다.`)) return
    setProcessingId(application.joinId)
    try {
      await deleteJoinApplication(application.joinId)
      setResult((prev) => prev && {
        ...prev,
        applications: prev.applications.filter((a) => a.joinId !== application.joinId),
      })
      if (openedDetail?.joinId === application.joinId) setOpenedDetail(null)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setProcessingId(null)
    }
  }

  if (!result) return <p className="text-sm text-gray-500">불러오는 중...</p>
  if (result.error) return <p className="text-sm text-red-500">{result.error}</p>
  if (result.applications.length === 0) return <p className="text-sm text-gray-500">가입 신청이 없습니다.</p>

  return (
    <section>
      <table className="w-full text-sm border-t border-gray-300">
        <thead>
          <tr className="text-left text-[#6B7280] border-b border-gray-200">
            <th className="py-2 font-normal">신청일</th>
            <th className="py-2 font-normal">이름</th>
            <th className="py-2 font-normal">학번</th>
            <th className="py-2 font-normal">학과</th>
            <th className="py-2 font-normal">상태</th>
            <th className="py-2 font-normal text-right">관리</th>
          </tr>
        </thead>
        <tbody>
          {result.applications.map((application) => {
            const isOpened = openedDetail?.joinId === application.joinId
            const isProcessing = processingId === application.joinId
            return (
              <JoinRow
                key={application.joinId}
                application={application}
                detail={isOpened ? openedDetail : null}
                isProcessing={isProcessing}
                onToggleDetail={() => handleToggleDetail(application.joinId)}
                onApprove={() => handleApprove(application)}
                onDelete={() => handleDelete(application)}
              />
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

function JoinRow({
  application,
  detail,
  isProcessing,
  onToggleDetail,
  onApprove,
  onDelete,
}: {
  application: JoinApplicationSummary
  detail: JoinApplicationDetail | null
  isProcessing: boolean
  onToggleDetail: () => void
  onApprove: () => void
  onDelete: () => void
}) {
  return (
    <>
      <tr className="border-b border-gray-100">
        <td className="py-2">{formatDate(application.createdAt)}</td>
        <td className="py-2">{application.name}</td>
        <td className="py-2">{application.studentId}</td>
        <td className="py-2">{application.major}</td>
        <td className="py-2">
          <span className={`px-2 py-0.5 rounded text-xs ${JOIN_STATUS_STYLE[application.status]}`}>
            {JOIN_STATUS_LABEL[application.status]}
          </span>
        </td>
        <td className="py-2">
          <div className="flex justify-end gap-2">
            <button
              onClick={onToggleDetail}
              className="px-3 py-1 rounded-full text-xs text-[#4B5563] bg-[#E5E7EB] hover:bg-gray-300 transition"
            >
              {detail ? "접기" : "상세"}
            </button>
            {application.status !== "APPROVED" && (
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="px-3 py-1 rounded-full text-xs text-white bg-[#3B82F6] hover:bg-[#2563EB] transition disabled:opacity-50"
              >
                승인
              </button>
            )}
            <button
              onClick={onDelete}
              disabled={isProcessing}
              className="px-3 py-1 rounded-full text-xs text-white bg-[#EF4444] hover:bg-[#DC2626] transition disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        </td>
      </tr>
      {detail && (
        <tr className="border-b border-gray-100 bg-white">
          <td colSpan={6} className="px-4 py-3 text-xs leading-6 text-[#374151]">
            <p><span className="text-[#9CA3AF] mr-2">전화번호</span>{detail.phone}</p>
            <p><span className="text-[#9CA3AF] mr-2">포트폴리오</span>{detail.portfolioUrl || "-"}</p>
            <p className="whitespace-pre-line"><span className="text-[#9CA3AF] mr-2">지원동기</span>{detail.motivation}</p>
            <p className="whitespace-pre-line"><span className="text-[#9CA3AF] mr-2">하고 싶은 말</span>{detail.comment || "-"}</p>
          </td>
        </tr>
      )}
    </>
  )
}
