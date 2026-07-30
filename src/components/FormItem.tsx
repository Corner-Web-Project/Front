import Input from "./Input";

interface FormItemProps {
  label: string;
  placeholder: string;
  required?: boolean;

  value: string;

  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;

  textarea?: boolean;
  maxLength?: number;
}

export default function FormItem({
  label,
  placeholder,
  required = false,
  value,
  onChange,
  textarea,
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

      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-3 outline-none resize-none focus:border-[#014BAA]"
        />
      ) : (
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-[#014BAA]"
        />
      )}

    </div>
  );
}