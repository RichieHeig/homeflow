interface SettingSelectProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SettingSelect({
  label,
  description,
  value,
  options,
  onChange,
  disabled = false,
}: SettingSelectProps) {
  return (
    <div className="py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
        {label}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
