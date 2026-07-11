import Input from "./Input";

interface FormItemProps {
  label: string;
  placeholder: string;
  required?: boolean;

  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormItem({
  label,
  placeholder,
  required = false,
  value,
  onChange
}: FormItemProps) {

  return (
    <div className="flex flex-col gap-2 w-full">

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
        className="w-full border border-gray-300 rounded-lg p-3"
      />

    </div>
  );
}