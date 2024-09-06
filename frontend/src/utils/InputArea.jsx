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
}) => {



  return (
    <>
      <input
        {...register(name, {
          required:
            required || emailPhone || password
              ? false
              : `${label} is required!`,
        })}
        defaultValue={defaultValue}
        value={value}
        id={name}
        type={type}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        autoComplete={autoComplete}
        min={min}
        step={step}
        autoCapitalize={autoCapitalize}
        className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-sm dark:text-gray-200 ${className}`}
      />
    </>
  );
};

export default InputArea;
