import React from "react";

const RadioButton = ({
  register,
  defaultValue,
  required,
  name,
  label,
  type,
  disabled,
  handleChange,
  emailPhone,
  password,
  value,
}) => {
  return (
    <>
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
        name={name}
        disabled={disabled}
        onChange={handleChange}
        className="form-check-input"
      />
    </>
  );
};

export default RadioButton;

export const Radio = ({
  name,
  errors = {},
  value,
  register,
  required = false,
  errorText = undefined,
  defaultValue,
}) => {
  return (
    <>
      {value?.map((curr, i) => (
        <label key={curr.id + i} htmlFor={curr.id + i}>
          <input
            type="radio"
            id={curr.id + i}
            {...register(name, { required })}
            name={name}
            value={curr.id}
            checked={defaultValue}
            className="text-primary-shade500 focus:ring-primary-shade500 w-6 h-6 "
          />
          <span className={`mx-2 ${errors && errors[name] && "text-red-600"}`}>
            {curr.name}
          </span>
        </label>
      ))}
      {errors && errors[name] && (
        <div className=" md:block hidden text-xs font-light text-red-600">
          {errors[name]?.message || " This is a required field"}
        </div>
      )}
    </>
  );
};
