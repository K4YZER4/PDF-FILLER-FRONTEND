interface Props {
  labelText: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  labelText,
  placeholder,
  value,
  onChange,
}: Props) {
  return (
    <div className="space-y-2">
      <label
        className="
            text-sm
            font-medium
            text-text-secondary
          "
      >
        {labelText}
      </label>
      <input
        id="email"
        autoComplete="username"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}
