import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import React, { useEffect, useState } from "react";
import { getLocalADBSDate } from "../functions/convertToLocalDate";

const InputDate = ({
  name,
  register,
  setValue,
  defaultDate = "",
  defaultValue,
  hideDefaultValue,
  className = "",
  languageType = "en",
  placeholder = "yyyy/ mm/ dd",
}) => {
  const dateFormat = localStorage.getItem("date");
  const [isDelayedRender, setIsDelayedRender] = useState(false);
  const [adDate, setAdDate] = useState("");
  const [bsDate, setBsDate] = useState("");

  //* this is necessary to make sure that the defaultDate value are displayed in first render of component
  useEffect(() => {
    if (dateFormat === "bs") {
      const timer = setTimeout(() => {
        setIsDelayedRender(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [dateFormat]);

  useEffect(() => {
    if (defaultValue) {
      const newDate = getLocalADBSDate(dateFormat, defaultValue);
      dateFormat === "bs" && setBsDate(newDate);
      dateFormat === "ad" && setAdDate(newDate);
    }
  }, [dateFormat, defaultValue]);

  return (
    <>
      {dateFormat === "ad" ? (
        <input
          type="date"
          {...register(name)}
          defaultValue={adDate}
          className={`h-8 border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white rounded-sm dark:text-gray-200 ${className} `}
        />
      ) : (
        isDelayedRender && (
          <Calendar
            onChange={({ bsDate, adDate }) => {
              setValue(name, adDate);
            }}
            language={languageType}
            defaultDate={defaultDate ? defaultDate : bsDate}
            hideDefaultValue={hideDefaultValue}
            placeholder={placeholder}
            className={`h-8 border-[1px] border-gray-400 dark:border-gray-400 dark:placeholder:text-white focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full placeholder:text-black bg-white dark:bg-slate-800 focus:bg-white rounded-sm dark:text-gray-200 ${className}`}
          />
        )
      )}
    </>
  );
};

export default InputDate;
