import React from "react";

const InputArea = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  placeholder,
  disabled,
  handleChange,
  emailPhone,
  password,
  autoComplete,
  value,
  min,
  step,
  autoCapitalize,
  className = "",
  isMobile = false,
  parseAs,
}) => {
  const registerOptions = {
    required: required || emailPhone || password ? false : `${label} is required!`,
    valueAsNumber: type === 'number',
    setValueAs: (v) => {
      if (parseAs === 'float') return parseFloat(v);
      if (parseAs === 'int') return parseInt(v, 10);
      return v;
    },
  };

  return (
    <>
      <input
        {...register(name, registerOptions)}
        type={type}
        defaultValue={defaultValue}
        value={value}
        id={name}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        autoComplete={autoComplete}
        min={min}
        step={step}
        autoCapitalize={autoCapitalize}
        className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      />
    </>
  );
};

export default InputArea;