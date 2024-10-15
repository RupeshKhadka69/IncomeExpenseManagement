import React from "react";

const InputWithoutOnChange = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  placeholder,
  disabled,
  autoComplete,
  value,
  min,
  step,
  className = "",
}) => {
  return (
    <>
      <input
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        defaultValue={defaultValue}
        value={value}
        type={type}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        step={step}
        className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-lg dark:text-gray-200 ${className}`}
      />
    </>
  );
};

export default InputWithoutOnChange;
