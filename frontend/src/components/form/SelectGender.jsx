import React from "react";

const SelectGender = (props) => {
  const { register, name, label, disabled, required } = props;

  const gender = [
    { _id: "", name: "--Select--" },
    { _id: "MALE", name: "MALE" },
    { _id: "FEMALE", name: "FEMALE" },
    { _id: "Others", name: "OTHERS" },
  ];

  return (
    <>
      <select
        className="border-[1px] border-gray-400  dark:border-gray-400 pl-2  h-8 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 bg-white disabled:bg-gray-200 form-select rounded-sm dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
      >
        {gender?.map((data) => (
          <option key={data?.name} value={data?._id} className="capitalize">
            {data?.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectGender;
