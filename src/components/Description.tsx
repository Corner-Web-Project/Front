import type { Dispatch, SetStateAction } from "react";
import type { Project } from "../types/project";

interface DescriptionProps {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

export default function Description({
  project,
  setProject,
}: DescriptionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-[#014BAA]">
        프로젝트 상세 설명
      </label>

      <textarea
        rows={6}
        value={project.description}
        placeholder="프로젝트에 대해 자세히 설명해주세요."
        onChange={(e) =>
          setProject((prev) => ({
            ...prev,
            description: e.target.value,
          }))
        }
        className="resize-none rounded-xl border p-4 outline-none focus:border-[#014BAA]"
      />
    </div>
  );
}