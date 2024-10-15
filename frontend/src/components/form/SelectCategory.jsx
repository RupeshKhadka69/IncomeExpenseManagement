import React from "react";
import ParentCategory from "../category/ParentCategory";

const SelectCategory = ({ setCategory }) => {
  return (
    <>
      <select
        onChange={(e) => setCategory(e.target.value)}
        className="border h-12 text-sm focus:outline-none block w-full form-input rounded-lg dark:bg-gray-800 dark:text-gray-100 text-gray-800"
      >
        <option value="All" selected hidden>
          Category
        </option>
        <ParentCategory />
      </select>
    </>
  );
};

export default SelectCategory;
