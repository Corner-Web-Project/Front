import Input from "./Input";

interface FormInputProps {
  label: string;
  placeholder: string;
  required?: boolean;

  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;

  maxLength?: number;
}

export default function FormInput({
  label,
  placeholder,
  required = false,
  value,
  onChange,
  maxLength,
}: FormInputProps) {
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

      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#014BAA]"
      />

      {maxLength && (
        <div className="text-right text-xs text-gray-400">
          {value.length} / {maxLength}
        </div>
      )}

    </div>
  );
}