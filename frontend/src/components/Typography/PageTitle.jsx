import React from "react";

const PageTitle = ({ children, className = "Raju" }) => {
  return (
    <h1
      className={`text-lg font-bold text-gray-700 dark:text-gray-300 ${className}`}
    >
      {children}
    </h1>
  );
};

export default PageTitle;
