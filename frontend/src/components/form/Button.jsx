import React from "react";

const Button = ({ children}) => {
  return (
    <button className="px-2 cursor-pointer py-2 flex gap-2 justify-center items-center bg-gray-800 text-white focus:ring-4 focus:ring-gray-300 enabled:hover:bg-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-gray-800 dark:enabled:hover:bg-gray-700 text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
      {children}
    </button>
  );
};

export default Button;
