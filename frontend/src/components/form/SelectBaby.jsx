import React from "react";

const SelectBaby = (props) => {
  const {
    register,
    name,
    label,
    disabled,
    required,
    className = "",
    defaultValue,
  } = props;

  const babyGender = [
    { _id: "", name: "--Select--" },
    { _id: "BOY", name: "BOY" },
    { _id: "GIRL", name: "GIRL" },
  ];

  return (
    <>
      <select
        className={`border-[1px] border-gray-400  dark:border-gray-400 pl-2  h-8 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 bg-white disabled:bg-gray-200 form-select rounded-sm dark:text-gray-200 ${className}`}
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        {babyGender?.map((data) => (
          <option key={data?.name} value={data?._id} className="capitalize">
            {data?.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectBaby;
