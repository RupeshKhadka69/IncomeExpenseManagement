import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";

export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "2px solid #7f69ef" : "1px solid #9ca3af",
    // This line disable the blue border
    boxShadow: state.isFocused ? "1px solid #7f69ef" : "1px solid #9ca3af",
    "&:hover": {
      border: state.isFocused ? "2px solid #7f69ef" : "1px solid #9ca3af",
    },
    height: 32,
    minHeight: 32,
    borderRadius: "8px",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#7f69ef" : "transparent",
    color: state.isFocused ? "white" : "black",
  }),
  zIndex: 9999,
};
const createOption = (id) => ({
  id,
  _id: id,
  name: id,
  label: id,
  value: id,
});

export default function InputTreatmentSelect({
  optionList,
  register,
  Controller,
  control,
  name,
  required = false,
  setValue,
  defaultValue,
  className = "",
  placeholder,
  disabled = false,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const sel = options?.find((opt) => opt?._id == defaultValue);
    setSelected(sel);
    if (!sel) {
      const createdDefaultValue = {
        id: defaultValue,
        value: defaultValue,
        label: defaultValue,
      };
      setSelected(createdDefaultValue);
    }
  }, [defaultValue, options]);

  useEffect(() => {
    setSelected(null);
    setOptions(optionList);
  }, [optionList]);

  const handleCreate = (inputValue) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    setIsLoading(false);
    setSelected(newOption);
    newOption && setValue(name, newOption._id);
  };

  const handleChange = (option) => {
    setSelected(option);
    setValue(name, option ? option._id : null);
  };

  return (
    <div className={`w-full ${className}`}>
      <Controller
        control={control}
        register={register}
        name={name}
        rules={{
          required: {
            value: required,
            message: `${name} is required!`,
          },
        }}
        render={() => (
          <CreatableSelect
            value={selected}
            placeholder={placeholder}
            isClearable
            isDisabled={disabled}
            isLoading={isLoading}
            onChange={handleChange}
            onCreateOption={handleCreate}
            options={options}
            styles={customStyles}
            maxMenuHeight={180}
          />
        )}
      />
    </div>
  );
}
