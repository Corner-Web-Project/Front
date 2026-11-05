export default function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="rounded-xl bg-[#014BAA] py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
    >
      {disabled ? '등록 중...' : '프로젝트 등록'}
    </button>
  );
}
