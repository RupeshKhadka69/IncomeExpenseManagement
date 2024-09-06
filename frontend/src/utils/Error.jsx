import React from "react";

const Error = ({ errorName, className = "" }) => {
  return (
    <>
      {errorName && (
        <span className={`text-red-400 text-sm mt-2 block ${className}`}>
          {errorName.message}
        </span>
      )}
    </>
  );
};

export default Error;
