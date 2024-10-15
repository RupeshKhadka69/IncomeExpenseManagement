import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { customStyles } from "./InputTreatmentSelect";

const createOption = (id) => ({
  id,
  name: id,
  label: id,
  value: id,
});

export default function InputLabSelect({
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
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState();
  const [selected, setSelected] = useState(null);
   
  useEffect(() => {
    const sel = options?.find((opt) => opt?.name == defaultValue);

    setSelected(sel);
    if (!sel) {
      const createdDefaultValue = {
        id: defaultValue,
        name: defaultValue,
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
    newOption && setValue(name, newOption.value);
  };

  const handleChange = (option) => {
    setSelected(option);
    option && setValue(name, option.name);
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
        // {...register(name, required)}
        render={() => (
          <CreatableSelect
            value={selected}
            placeholder={placeholder}
            isClearable
            isDisabled={isLoading}
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
