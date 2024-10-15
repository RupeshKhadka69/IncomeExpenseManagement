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
}) => {
  return (
    <>
      {type === "radio" ? (
        <div className={`flex items-center ${className}`}>
          <label className="mr-3">
            <input
              type="radio"
              {...register(`${name}`, { required: required })}
              value="male"
              defaultChecked={defaultValue === "male"}
              disabled={disabled}
              onChange={handleChange}
              autoComplete={autoComplete}
              className="mr-1 form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary"
            />
            Male
          </label>
          <label className="mr-3">
            <input
              type="radio"
              {...register(`${name}`, { required: required })}
              value="female"
              defaultChecked={defaultValue === "female"}
              disabled={disabled}
              onChange={handleChange}
              autoComplete={autoComplete}
              className="mr-1"
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              {...register(`${name}`, { required: required })}
              value="others"
              defaultChecked={defaultValue === "others"}
              disabled={disabled}
              onChange={handleChange}
              autoComplete={autoComplete}
              className="mr-1"
            />
            Others
          </label>
        </div>
      ) : (
        <input
          {...register(`${name}`, {
            required:
              required || emailPhone || password
                ? false
                : `${label} is required!`,
          })}
          defaultValue={defaultValue}
          value={value}
          type={type}
          placeholder={placeholder}
          name={name}
          disabled={disabled}
          onChange={handleChange}
          autoComplete={autoComplete}
          min={min}
          step={step}
          autoCapitalize={autoCapitalize}
          className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-3 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-lg dark:text-gray-200 ${className}`}
        />
      )}
    </>
  );
};

export default InputArea;
