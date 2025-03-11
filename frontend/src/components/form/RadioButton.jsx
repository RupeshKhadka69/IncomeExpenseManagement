import React from "react";
import { Radio as AntRadio, ConfigProvider } from "antd";
import { Controller } from "react-hook-form";
export const AntdRadio = ({
  name,
  errors = {},
  value,
  control,
  required = false,
  defaultValue,
  labelClassName = "",
}) => {
  const customToken = {
    //* To customize the radio button appearance
    token: {
      lineWidth: 2, // Border width
      colorBorder: "#999", // Border color
      colorPrimary: "rgb(var(--color-primary))", // Primary color for checked state
    },
  };
  return (
    <>
      <ConfigProvider theme={customToken}>
        <Controller
          name={name}
          control={control}
          rules={{ required: required ? false : "This is a required field" }}
          defaultValue={defaultValue}
          render={({ field }) => (
            <AntRadio.Group {...field}>
              {value?.map((curr, i) => (
                <AntRadio
                  key={String(curr.id) + String(i)}
                  value={curr.id}
                  className={errors[name] ? "ant-radio-wrapper-error" : ""}
                >
                  <span
                    className={`${
                      errors[name] ? "text-red-600" : ""
                    } text-gray-600 dark:text-gray-200 ${labelClassName} `}
                  >
                    {curr.name}
                  </span>
                </AntRadio>
              ))}
            </AntRadio.Group>
          )}
        />
      </ConfigProvider>
      {errors && errors[name] && (
        <div className="hidden text-xs font-light text-red-600 md:block">
          {errors[name]?.message || " This is a required field!"}
        </div>
      )}
    </>
  );
};

export default AntdRadio;