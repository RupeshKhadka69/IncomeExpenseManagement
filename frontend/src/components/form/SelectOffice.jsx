import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import OfficeServices from "../../services/OfficeServices";
const SelectOffice = (props) => {
  const { register, name, label } = props;

  const { data: officeList, isLoading } = useQuery({
    queryFn: () => OfficeServices.getAllOffice(),
    queryKey: ["get-office-type-list"],
    select: (d) => d.officeTypes,
    // onSuccess: (d) => console.log(d),
    staleTime: 0,
    retry: (count, { response }) => {
      return response.status !== 403 && response.status !== 404;
    },
  });

  return (
    <>
      <select
        className="border-[1px] border-gray-400 dark:border-gray-400 pl-2 bg-white h-8 text-sm focus:border-none focus:outline-none focus:ring-2 focus:ring-primary block w-full dark:bg-gray-800 focus:bg-white form-select rounded-sm dark:text-gray-200"
        name={name}
        {...register(`${name}`, {
          required: `${label} is required!`,
        })}
      >
        <option value="">--Select--</option>
        {officeList ? (
          officeList?.map((data) => (
            <option key={data?.name} value={data?._id} className="capitalize">
              {data?.name}
            </option>
          ))
        ) : (
          <>{/* <option value="User">No Health Post Office Found</option> */}</>
        )}
      </select>
    </>
  );
};

export default SelectOffice;
