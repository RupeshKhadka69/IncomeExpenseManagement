import React from "react";

const TextArea = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  placeholder,
  disabled,
  handleChange,
  cols,
  rows = 3,
  className = "",
}) => {
  return (
    <>
      <textarea
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        onChange={handleChange}
        cols={cols}
        rows={rows}
        className={`border-[1px] border-gray-400 !rounded-lg dark:border-gray-400 focus:ring-2 focus:ring-primary focus:border-primary pl-2 pt-2 text-sm focus:outline-none block w-full dark:bg-slate-800 focus:bg-white form-input  dark:text-gray-200  ${className}`}
      />
    </>
  );
};

export default TextArea;
