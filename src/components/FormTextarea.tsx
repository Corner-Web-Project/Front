interface FormTextareaProps {
  label: string;
  placeholder: string;
  required?: boolean;

  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;

  maxLength?: number;
}

export default function FormTextarea({
  label,
  placeholder,
 required = false,
  value,
  onChange,
  maxLength,
}: FormTextareaProps) {
  return (
    <div className="flex w-full flex-col gap-2">

      <div className="flex items-center gap-1">
        <span className="text-sm font-semibold">
          {label}
        </span>

        {required && (
          <span className="text-red-500">*</span>
        )}
      </div>

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={5}
        maxLength={maxLength}
        className="w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:border-[#014BAA]"
      />

      {maxLength && (
        <div
          className={`text-right text-xs ${
            value.length >= maxLength * 0.9
              ? "text-red-500"
              : "text-gray-400"
          }`}
        >
          {value.length} / {maxLength}
        </div>
      )}

    </div>
  );
}