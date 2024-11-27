const AssignmentField = ({ label, icon: Icon, value, options, onChange, isDisabled }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </span>
    </label>
    {isDisabled ? (
      <input type="text" value={value} className="input input-bordered w-full" disabled />
    ) : (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select select-bordered w-full"
        required
      >
        <option value="">{`Select ${label}`}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )}
  </div>
);

export default AssignmentField;
