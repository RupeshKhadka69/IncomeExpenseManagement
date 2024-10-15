import React from "react";

const SelectTargetUser = (props) => {
  const { optionData, register, name, handleChange } = props;
  return (
    <>
      <select
        className="border  h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 focus:bg-white form-select rounded-md dark:text-gray-200 mt-3"
        name={name}
        {...register(`${name}`, {
          required: false,
        })}
        onChange={handleChange}
      >
        <option value="">--- Select Target User ---</option>
        {optionData &&
          optionData?.map((data) => (
            <option key={data.id} value={data.title} className="capitalize">
              {data.title}
            </option>
          ))}
      </select>
    </>
  );
};

export default SelectTargetUser;
