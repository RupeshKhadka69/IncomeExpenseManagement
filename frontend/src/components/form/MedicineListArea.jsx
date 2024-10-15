import React, { useState } from "react";
import Select from 'react-select';
import { Controller } from 'react-hook-form';

const MedicineListArea = (props) => {
  const { register, name, optionList, setSelectedMedicine, setValue, setError, control } = props;

  const [selectedOption, setSelectedOption] = useState();

  const medicine_name = optionList?.map((data) => ({
    label: data?.name,
    value: data?.name,
  }));

  const handleOptionChange = (med) => {
    if (!med) {
      setError(name, {
        type: "manual",
        message: "Selected option cannot be empty!",
      });
      return;
    }

    setSelectedOption(med);
    setSelectedMedicine(med.value);
    setValue(name, med.value);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: state.isFocused ? "2px solid #7f69ef" : "1px solid black",
      boxShadow: state.isFocused ? "1px solid #7f69ef" : "1px solid black",
      "&:hover": {
        border: state.isFocused ? "2px solid #7f69ef" : "1px solid black",
      },
      height: "50px",
      borderRadius: "7px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#7f69ef" : "transparent",
      color: state.isFocused ? "white" : "black",
    }),
  };

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            className="dark:bg-gray-800 bg-white disabled:bg-gray-200 dark:text-gray-200"
            onChange={(selectedOption) => {
              handleOptionChange(selectedOption);
            }}
            options={medicine_name}
            styles={customStyles}
            placeholder="--Select--"
            value={selectedOption}
          />
        )}
      />
    </>
  );
};

export default MedicineListArea;
