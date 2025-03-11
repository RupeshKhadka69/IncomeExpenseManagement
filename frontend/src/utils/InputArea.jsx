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
  rules = {}, // Add rules prop to receive validation rules
}) => {
  // Merge default registerOptions with passed rules
  const registerOptions = {
    ...rules, // Include all passed rules from parent
    valueAsNumber: type === 'number',
    setValueAs: (v) => {
      if (parseAs === 'float') return parseFloat(v);
      if (parseAs === 'int') return parseInt(v, 10);
      return v;
    },
  };

  // If no specific required rule was passed but required prop is true,
  // add a generic required message
  if (required && !rules.required) {
    registerOptions.required = `${label || name} is required!`;
  }

  return (
    <input
      {...register(name, registerOptions)}
      type={type}
      defaultValue={defaultValue}
      id={name}
      placeholder={placeholder}
      name={name}
      disabled={disabled}
      onChange={handleChange}
      autoComplete={autoComplete}
      min={min}
      step={step}
      autoCapitalize={autoCapitalize}
      className={`border-[1px] border-gray-400 !rounded-lg dark:border-gray-400 focus:ring-2 focus:ring-primary focus:border-primary pl-2 pt-2 text-sm focus:outline-none block w-full dark:bg-slate-800 focus:bg-white form-input  dark:text-gray-200  ${className}`}
    />
  );
};

export default InputArea;