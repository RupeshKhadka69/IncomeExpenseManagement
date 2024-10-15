import React from "react";

const SelectTreatment = (props) => {
  const { register, name, label, disabled, required, optionList } = props;

  return (
    <>
      <select
        className="border-[1px] border-black dark:border-gray-400 pl-2  h-12 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 bg-white disabled:bg-gray-200 form-select rounded-md dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
      >
        <option value="">--Select--</option>
        {optionList ? (
          optionList?.map((data, index) => {
            return (
              <option
                key={data?.id + String(index)}
                value={data?._id}
                className="capitalize text-black"
              >
                {index + 1} - {data?.name}
              </option>
            );
          })
        ) : (
          <></>
        )}
      </select>
    </>
  );
};

export default SelectTreatment;
