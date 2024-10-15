import React from "react";

const Input = ({
  name,
  value,
  defaultValue,
  required = false,
  placeholder = "",
  id = "form_" + name,
  shouldUnregister = false,
  errors = {},
  register,
  type = "text",
  label,
  showError = true,
  disabled = false,
  labelClassName = "",
  className,
}) => {
  return (
    <div className=" grid grid-cols-1 dark:text-white gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-4">
        {label && (
          <>
            &bull; &nbsp;
            <label
              className={`my-6 ${
                name
                  .split(".")
                  .reduce((p, c) => (p && p[c]) || undefined, errors) &&
                "text-red-600"
              } text-sm ${labelClassName}`}
              htmlFor={id}
            >
              {label}
            </label>
            <br />
          </>
        )}

        <div className="mt-2">
          <input
            id={id}
            {...register(name, { required, shouldUnregister })}
            placeholder={placeholder}
            type={type}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            className={`block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
          />
          {showError &&
            name
              .split(".")
              .reduce((p, c) => (p && p[c]) || undefined, errors) && (
              <>
                <span className="text-xs font-light text-red-600">
                  {name
                    .split(".") // @ts-ignore
                    .reduce((p, c) => (p && p[c]) || undefined, errors)
                    ?.message || "This is a required field."}
                </span>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default Input;
