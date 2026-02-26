type IntegrationOption = {
  label: string;
  value: string;
};

type IntegrationSelectProps = {
  label?: string;
  value: string;
  options: IntegrationOption[];
  onChange: (value: string) => void;
};

export function IntegrationSelect({
  label = "Select integration",
  value,
  options,
  onChange,
}: IntegrationSelectProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="select">
        <select value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select-icon" aria-hidden="true">
          ▾
        </span>
      </div>
    </label>
  );
}
