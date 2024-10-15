import React from "react";

const CheckBox = ({
  register,
  defaultValue,
  required,
  name,
  label,
  disabled,
  handleChange,
  emailPhone,
  password,
  value,
  id,
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
        type="checkbox"
        name={name}
        disabled={disabled}
        onChange={handleChange}
        className="form-checkbox"
        id={id}
      />
    </>
  );
};

export default CheckBox;
