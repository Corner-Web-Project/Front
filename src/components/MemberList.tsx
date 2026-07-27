import type { Dispatch, SetStateAction } from "react";

import type { Member } from "../types/projectup";
import Input from "./Input";
interface MemberListProps {
  members: Member[];
  setMembers: Dispatch<SetStateAction<Member[]>>;
}

export default function MemberList({
  members,
  setMembers,
}: MemberListProps) {

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        role: "",
        name: "",
      },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length === 1) return;

    setMembers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const updateMember = (
    index: number,
    field: "role" | "name",
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index
          ? {
              ...member,
              [field]: value,
            }
          : member
      )
    );
  };

  return (
    <div className="flex flex-col gap-5">

      <div className="flex items-center justify-between">

        <h2 className="font-bold text-[#014BAA]">
          프로젝트 팀원
        </h2>

        <button
          type="button"
          onClick={addMember}
          className="rounded-lg bg-[#014BAA] px-4 py-2 text-white"
        >
          + 팀원 추가
        </button>

      </div>

      <div className="flex flex-col gap-3">

        {members.map((member, index) => (

          <div
            key={index}
            className="flex gap-3"
          >

            <Input
              value={member.role}
              placeholder="역할"
              onChange={(e) =>
                updateMember(
                  index,
                  "role",
                  e.target.value
                )
              }
              className="flex-1 rounded-xl border p-3"
            />

            <Input
              value={member.name}
              placeholder="이름"
              onChange={(e) =>
                updateMember(
                  index,
                  "name",
                  e.target.value
                )
              }
              className="flex-1 rounded-xl border p-3"
            />

            <button
              type="button"
              onClick={() => removeMember(index)}
              className="rounded-lg bg-red-500 px-4 text-white"
            >
              삭제
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}