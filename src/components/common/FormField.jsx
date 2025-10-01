import { forwardRef } from 'react';

const FormField = forwardRef(({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  help,
  options = [],
  rows = 3,
  accept,
  min,
  max,
  step,
  className = "",
  inputClassName = "",
  ...props
}, ref) => {
  const baseInputClasses = `w-full ${error ? 'input-error' : ''} ${inputClassName}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            ref={ref}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            className={`select select-bordered ${baseInputClasses}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            ref={ref}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            rows={rows}
            className={`textarea textarea-bordered ${baseInputClasses}`}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <label className="label cursor-pointer justify-start gap-3">
            <input
              ref={ref}
              type="checkbox"
              name={name}
              checked={value || false}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              required={required}
              className="checkbox checkbox-primary"
              {...props}
            />
            <span className="label-text">{label}</span>
          </label>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option) => (
              <label key={option.value} className="label cursor-pointer justify-start gap-3">
                <input
                  ref={ref}
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  required={required}
                  className="radio radio-primary"
                  {...props}
                />
                <span className="label-text">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <input
            ref={ref}
            type="file"
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            accept={accept}
            disabled={disabled}
            required={required}
            className={`file-input file-input-bordered ${baseInputClasses}`}
            {...props}
          />
        );

      default:
        return (
          <input
            ref={ref}
            type={type}
            name={name}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            min={min}
            max={max}
            step={step}
            accept={accept}
            className={`input input-bordered ${baseInputClasses}`}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`form-control ${className}`}>
        {renderInput()}
        {help && <div className="label"><span className="label-text-alt text-base-content/60">{help}</span></div>}
        {error && <div className="label"><span className="label-text-alt text-error">{error}</span></div>}
      </div>
    );
  }

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text font-medium">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      {renderInput()}
      {help && <div className="label"><span className="label-text-alt text-base-content/60">{help}</span></div>}
      {error && <div className="label"><span className="label-text-alt text-error">{error}</span></div>}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;