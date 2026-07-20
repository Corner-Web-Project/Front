import type { Dispatch, SetStateAction } from "react";
import type { Project } from "../types/project";
import Input from "./Input";
interface ProjectInfoProps {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

export default function ProjectInfo({
  project,
  setProject,
}: ProjectInfoProps) {
  return (
    <div className="flex flex-col gap-5">

      <div className="flex flex-col gap-2">
        <label className="font-bold text-[#014BAA]">
          프로젝트 이름
        </label>

        <Input
          value={project.title}
          placeholder="프로젝트 이름"
          onChange={(e) =>
            setProject((prev) => ({
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
          value={project.subtitle}
          placeholder="프로젝트를 한 줄로 소개해주세요."
          onChange={(e) =>
            setProject((prev) => ({
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