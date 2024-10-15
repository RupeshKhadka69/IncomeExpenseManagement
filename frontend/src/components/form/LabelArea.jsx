import React from "react";

const LabelArea = ({ label, size, className = "" }) => {
  return (
    <label
      className={`font-medium self-center ${
        size ? size : "text-sm"
      } dark:text-gray-300 ${className}`}
    >
      {label}
    </label>
  );
};

export default LabelArea;
