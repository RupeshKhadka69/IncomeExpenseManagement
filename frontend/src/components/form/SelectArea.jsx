import React from "react";

const SelectArea = (props) => {
  const {
    register,
    name,
    label,
    optionList,
    disabled,
    required,
    className,
    showSelect = false,
    defaultValue,
  } = props;
        
  return (
    <>
      <select
        className={`border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-3 h-8 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white form-input rounded-lg dark:text-gray-200 ${className}`}
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
        defaultValue={defaultValue}
      >
        {showSelect && <option value="">--Select--</option>}
        {optionList ? (
          optionList?.map((data, index) => (
            <option
              key={String(data?._id) + String(index)}
              value={data?._id}
              className="capitalize"
            >
              {data.name
                ? data.name
                : data.disease_name
                ? data.disease_name
                : ""}{" "}
              {data.type ? `(${data.type})` : ""}{" "}
              {data?.count >= 0 ? `- ${data?.count}` : ""}
              {data?.bed_number ? data?.bed_number : ""}
            </option>
          ))
        ) : (
          <></>
        )}
      </select>
    </>
  );
};

export default SelectArea;
