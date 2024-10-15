import React from "react";

const Button = ({ children}) => {
  return (
    <button className="px-2 cursor-pointer py-2 flex gap-2 justify-center items-center  bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
      {children}
    </button>
  );
};

export default Button;
