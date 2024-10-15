import React from "react";

const SelectDelivery = (props) => {
  const {
    register,
    name,
    label,
    disabled,
    required,
    className = "",
    defaultValue,
  } = props;

  const deliveryType = [
    { _id: "", name: "--Select--" },
    { _id: "NORMAL", name: "Normal" },
    { _id: "C-Section", name: "C-Section" },
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
        {deliveryType?.map((data) => (
          <option key={data?.name} value={data?._id} className="capitalize">
            {data?.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectDelivery;
