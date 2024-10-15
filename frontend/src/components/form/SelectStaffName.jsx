import React from "react";

const SelectStaffName = (props) => {
  const { register, name, label, optionList, disabled, required, className } =
    props;

  return (
    <>
      <select
        className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-sm dark:text-gray-200 ${className}`}
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
      >
        <option value="">--Select--</option>
        {optionList ? (
          optionList?.map((data, index) => (
            <option
              key={String(data?._id) + String(index)}
              value={data?.name}
              className="capitalize"
            >
              {data.name
                ? data.name
                : data.disease_name
                ? data.disease_name
                : ""}{" "}
              {data.type ? `(${data.type})` : ""}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
    </>
  );
};

export default SelectStaffName;
