import React from "react";

const InputValue = ({
  register,
  required,
  maxValue,
  minValue,
  defaultValue,
  name,
  label,
  type,
  placeholder,
  disabled,
  className,
}) => {
  const value = {
    valueAsNumber: true,
    required: required ? false : `${label} is required!`,
    max: {
      value: maxValue,
      message: `Maximum value ${maxValue}!`,
    },
    min: {
      value: minValue,
      message: `Minimum value ${minValue}!`,
    },
  };
  return (
    <>
      <input
        {...register(`${name}`, value)}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-sm dark:text-gray-200 ${className}`}
      />
    </>
  );
};

export default InputValue;
