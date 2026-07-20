import type { Dispatch, SetStateAction } from "react";
import type { Project } from "../types/project";

interface ImageUploadProps {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

export default function ImageUpload({
  project,
  setProject,
}: ImageUploadProps) {
  return (
    <div className="grid grid-cols-2 gap-5">

      <div className="flex flex-col gap-2">

        <label className="font-bold text-[#014BAA]">
          로고
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setProject((prev) => ({
              ...prev,
              logo: e.target.files?.[0] ?? null,
            }))
          }
        />

        {project.logo && (
          <img
            src={URL.createObjectURL(project.logo)}
            className="h-32 rounded-xl object-cover"
          />
        )}

      </div>

      <div className="flex flex-col gap-2">

        <label className="font-bold text-[#014BAA]">
          배너
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setProject((prev) => ({
              ...prev,
              banner: e.target.files?.[0] ?? null,
            }))
          }
        />

        {project.banner && (
          <img
            src={URL.createObjectURL(project.banner)}
            className="h-32 rounded-xl object-cover"
          />
        )}

      </div>

    </div>
  );
}