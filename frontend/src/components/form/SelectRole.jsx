import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";

const SelectRole = (props) => {
  const { register, name, label } = props;
  const { rolesList } = useContext(AdminContext);

  return (
    <>
      <select
        className="border-[1px] border-gray-400 dark:border-gray-400 pl-2 bg-white h-8 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 focus:bg-white form-select rounded-sm dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        {rolesList ? (
          rolesList?.map((data) => (
            <option key={data?.name} value={data?._id} className="capitalize">
              {data?.name}
            </option>
          ))
        ) : (
          <>
            <option value="User">No Role Found</option>
          </>
        )}
      </select>
    </>
  );
};

export default SelectRole;
