import React from "react";

const SelectOption = (props) => {
  const { optionData, register, name, label } = props;
  return (
    <>
      <select
        className="border  h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-gray-800 focus:bg-white form-select rounded-md dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        {optionData ? (
          optionData?.map((data) => (
            <option value={data?.role} className="capitalize">
              {data?.role}
            </option>
          ))
        ) : (
          <>
            <option value="Music">Music</option>
            <option value="Comedy">Comedy</option>
            <option value="Education">Education </option>
            <option value="Finance">Finance </option>
            <option value="superadmin">superadmin </option>
            <option value="Finance">Finance </option>
          </>
        )}
      </select>
    </>
  );
};

export default SelectOption;
