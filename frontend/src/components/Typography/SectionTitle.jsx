import React from "react";

const SectionTitle = ({ children, className = "" }) => {
  return (
    <h2
      className={`font-semibold text-[#7f69ef] ${className}`}
    >
      {children}
    </h2>
  );
};

export default SectionTitle;
