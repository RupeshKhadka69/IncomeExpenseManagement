import Calendar from "@sbmdkl/nepali-datepicker-reactjs";
import "@sbmdkl/nepali-datepicker-reactjs/dist/index.css";
import React, { useEffect, useState } from "react";
import { getLocalADBSDate } from "../../utils/date";

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
  
  const dateFormat ="bs";
  const [isDelayedRender, setIsDelayedRender] = useState(false);
  const [adDate, setAdDate] = useState("");
  const [bsDate, setBsDate] = useState(null);
  //* to mount component for Calendar when state changes
  const [key, setKey] = useState("");

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

      if (dateFormat === "bs") {
        setBsDate(newDate);
        setKey(newDate);
      } else if (dateFormat === "ad") {
        setAdDate(newDate);
      }
    }
  }, [dateFormat, defaultValue]);

  const handleClear = () => {
    setValue(name, "");
    setKey(name);
    setBsDate(null);
  };

  return (
    <div className="relative">
      {dateFormat === "ad" ? (
        <input
          type="date"
          {...register(name)}
          defaultValue={adDate}
          className={`h-8 border-[1px] border-gray-400 dark:border-gray-400 focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full bg-white dark:bg-slate-800 focus:bg-white rounded-sm dark:text-gray-200 ${className} `}
        />
      ) : (
        isDelayedRender && (
          <>
            <Calendar
              onChange={({ bsDate, adDate }) => {
                setValue(name, adDate);
                setKey(bsDate);
                setBsDate(bsDate);
              }}
              key={key}
              language={languageType}
              defaultDate={defaultDate ? defaultDate : bsDate}
              // hideDefaultValue={hideDefaultValue || !bsDate}
              hideDefaultValue={!bsDate}
              placeholder={placeholder}
              className={`h-8 border-[1px] border-gray-400 dark:border-gray-400 dark:placeholder:text-white focus:ring-2 disabled:bg-gray-100 focus:ring-primary focus:border-none pl-2 text-sm focus:outline-none block w-full placeholder:text-black bg-white dark:bg-slate-800 focus:bg-white rounded-sm dark:text-gray-200 ${className}`}
            />
            {bsDate && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute w-4 h-4 text-gray-500 transform -translate-y-1/2 accent-gray-500 right-1 top-3.5 hover:text-gray-700"
              >
                ✖
              </button>
            )}
          </>
        )
      )}
    </div>
  );
};

export default InputDate;
