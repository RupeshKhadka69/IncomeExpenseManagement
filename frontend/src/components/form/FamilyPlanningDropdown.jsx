import React from "react";

const FamilyPlanningDropdown = ({ name, optionList, register ,onChange }) => {
    return (
      <>
        <select
          {...register(`${name}`)}  
          defaultValue={""}
          onChange={onChange}
          className="border-[1px] border-gray-400 dark:border-gray-400 pl-2  rounded-sm  text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 bg-white disabled:bg-gray-200 form-select  dark:text-gray-200 h-8"
        >
          <option value="" disabled hidden>
            Choose one
          </option>
          {optionList.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </>
    );
  };
  
  export default FamilyPlanningDropdown;
  
