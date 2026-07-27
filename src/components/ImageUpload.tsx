import type { Dispatch, SetStateAction } from "react";
import type { Projectup } from "../types/projectup";

interface ImageUploadProps {
  projectup: Projectup;
  setProjectup: Dispatch<SetStateAction<Projectup>>;
}

export default function ImageUpload({
  projectup,
  setProjectup,
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
            setProjectup((prev) => ({
              ...prev,
              logo: e.target.files?.[0] ?? null,
            }))
          }
        />

        {projectup.logo && (
          <img
            src={URL.createObjectURL(projectup.logo)}
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
            setProjectup((prev) => ({
              ...prev,
              banner: e.target.files?.[0] ?? null,
            }))
          }
        />

        {projectup.banner && (
          <img
            src={URL.createObjectURL(projectup.banner)}
            className="h-32 rounded-xl object-cover"
          />
        )}

      </div>

    </div>
  );
}