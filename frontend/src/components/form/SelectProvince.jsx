import React from "react";
import data from "../../places.json";

const SelectProvince = (props) => {
  const { register, name, label, disabled, required } = props;

  return (
    <>
      <select
        className="border-[1px] border-black disabled:bg-gray-100 dark:border-gray-400 pl-2  h-12 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 focus:bg-white form-select rounded-md dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
      >
        {data?.map((data) => (
          <option key={data?.name} value={data?.id} className="capitalize">
            {data?.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectProvince;
