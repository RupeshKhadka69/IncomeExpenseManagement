import React from "react";

const MedicineTypeArea = (props) => {
    const {
    register,
    name,
    label,
    optionList,
    disabled,
    required,
    setSelectedMedicine,
    setSelectedDosages,
    handleChangeDosage
  } = props;
    
  return (
    <>
      <select
        className="border border-gray-400 dark:border-gray-400 pl-2 h-8 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 bg-white disabled:bg-gray-200 form-select rounded-lg dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: required ? false : `${label} is required!`,
        })}
        disabled={disabled}
        onChange={(event) => handleChangeDosage(event, optionList, setSelectedMedicine)}
      >
        <option value="">--Select--</option>
        {optionList ? (
          optionList?.map((data, index) => {
            return (
              <option
                key={String(data?._id) + String(index)}
                value={`${data?.form} ${data?.strengths}`}
                className="capitalize text-black"
              >
                {data?.form} {data?.strengths}
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

export default MedicineTypeArea;
