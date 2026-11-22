import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Projectup } from "../types/projectup";

interface ImageUploadProps {
  projectup: Projectup;
  setProjectup: Dispatch<SetStateAction<Projectup>>;
}

function ImageField({ label, file, onChange }: { label: string; file: File | null; onChange: (file: File | null) => void }) {
  const preview = useRef<HTMLImageElement>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (preview.current) preview.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return <div className="flex min-w-0 flex-col gap-2">
    <label className="flex flex-col gap-2 font-bold text-[#014BAA]">{label} (선택)
      <input type="file" accept="image/png,image/jpeg" className="w-full text-sm font-normal" onChange={(e) => {
        const selected = e.target.files?.[0] ?? null;
        setError('');
        if (selected && (!['image/png', 'image/jpeg'].includes(selected.type) || selected.size === 0 || selected.size > 5 * 1024 * 1024)) {
          setError('PNG/JPEG 이미지를 5MB 이하로 선택해주세요.');
          e.target.value = '';
          onChange(null);
          return;
        }
        onChange(selected);
      }} />
    </label>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {file && <img ref={preview} alt={`${label} 미리보기`} className="h-32 rounded-xl object-contain" />}
  </div>;
}

export default function ImageUpload({ projectup, setProjectup }: ImageUploadProps) {
  return <div>
    <p className="mb-3 text-sm text-gray-500">PNG/JPEG · 파일당 최대 5MB · 최대 1600만 화소</p>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <ImageField label="로고" file={projectup.logo} onChange={(logo) => setProjectup((prev) => ({ ...prev, logo }))} />
      <ImageField label="배너" file={projectup.banner} onChange={(banner) => setProjectup((prev) => ({ ...prev, banner }))} />
    </div>
  </div>;
}
