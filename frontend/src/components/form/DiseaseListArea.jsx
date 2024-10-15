import React, { useEffect, useRef, useState } from "react";

const DiseaseListArea = (props) => {
  const {
    optionList,
    name,
    icd11name,
    setValue,
    setError,
    diagnosis,
    selectedDisease,
  } = props;

  const [selectedOption, setSelectedOption] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNodeVisible, setIsNodeVisible] = useState(false);
  const dropRef = useRef();

  useEffect(() => {
    setSelectedOption(diagnosis || "");
  }, [diagnosis]);
  const handleOptionChange = (disease) => {
    console.log(disease, "disease");
    setSelectedOption(disease.disease_name);
    setIsNodeVisible(false);
    setValue(name, disease.disease_name);
    setValue(icd11name, disease.icd11_code);
    setSearchTerm("");
  };
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // useEffect(() => {
  //   setIsNodeVisible(isVisible);
  // }, [isVisible]);
  return (
    <div className=" w-full">
      <div
        className={` p-2 focus:outline-none text-base flex bg-white border  items-center justify-between ${
          selectedOption ? "text-black border-2 border-black" : "text-gray-400"
        } ${
          isNodeVisible ? "border-2 border-black" : ""
        } cursor-pointer rounded-md`}
        onClick={() => {
          // toggleVisibility();
          setIsNodeVisible((prev) => !prev);
        }}
      >
        {selectedDisease
          ? `(${selectedDisease.icd11_code}) ${selectedDisease.disease_name}`
          : selectedOption
          ? selectedOption
          : "Select options"}

        <span className="ml-2">{isNodeVisible ? "▲" : "▼"}</span>
      </div>

      {isNodeVisible ? (
        <div className="absolute z-40 top-full  p-1 left-0 mt-2 w-full bg-white border border-gray-300 rounded shadow-md">
          <input
            type="text"
            className="p-2 w-full border-b border-gray-300 text-black focus:outline-none text-lg"
            placeholder="Search options"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <ul className="max-h-48 overflow-y-auto scrollbar-thumb-red-500 scrollbar-track-red-200 scrollbar-thumb-rounded-full">
            {optionList
              .filter((options) =>
                options.disease_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((options, index) => {
                return (
                  <li
                    key={index}
                    className="p-3  cursor-pointer hover:bg-gradient-to-r from-[#FDC78D] to-[#F98FFD] hover:rounded-md  text-black text-lg"
                    onClick={() => handleOptionChange(options)}
                  >
                    {`(${options.icd11_code}) ${options.disease_name}`}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default DiseaseListArea;
