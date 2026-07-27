import type { Dispatch, SetStateAction } from "react";
import type { Projectup } from "../types/projectup";
import Input from "./Input";
interface ProjectupInfoProps {
  projectup: Projectup;
  setProjectup: Dispatch<SetStateAction<Projectup>>;
}

export default function ProjectupInfo({
  projectup,
  setProjectup,
}: ProjectupInfoProps) {
  return (
    <div className="flex flex-col gap-5">

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[#014BAA]">
          프로젝트 이름
        </label>

        <Input
          value={projectup.title}
          placeholder="프로젝트 이름"
          onChange={(e) =>
            setProjectup((prev) => ({
              ...prev,
              title: e.target.value,
            }))
          }
          className="rounded-xl border p-3 outline-none focus:border-[#014BAA]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[#014BAA]">
          한 줄 설명
        </label>

        <Input
          value={projectup.subtitle}
          placeholder="프로젝트를 한 줄로 소개해주세요."
          onChange={(e) =>
            setProjectup((prev) => ({
              ...prev,
              subtitle: e.target.value,
            }))
          }
          className="rounded-xl border p-3 outline-none focus:border-[#014BAA]"
        />
      </div>

    </div>
  );
}