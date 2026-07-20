import type { Dispatch, SetStateAction } from "react";
import type { Project } from "../types/project";
interface GenerationSelectProps {
  generation: string;
  setProject: Dispatch<SetStateAction<Project>>;
}

const generations = ["1기", "2기", "3기", "4기"];

export default function GenerationSelect({
  generation,
  setProject,
}: GenerationSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-bold text-[#014BAA]">
        기수
      </label>

      <div className="grid grid-cols-4 gap-3">
        {generations.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() =>
              setProject((prev) => ({
                ...prev,
                generation: item,
              }))
            }
            className={`rounded-xl border py-3 font-bold transition
            ${
              generation === item
                ? "bg-[#014BAA] text-white border-[#014BAA]"
                : "bg-white text-[#014BAA] border-[#014BAA]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}