import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-slate-200 h-[92vh] overflow-y-scroll">
      <nav className="w-full">
        <ul className="flex flex-col w-full">
          <li className="w-full">
            <Link to="/" className="block p-2 bg-slate-400 w-full hover:bg-slate-500">Home</Link>
          </li>
          <li className="w-full">
            <Link to="/expense" className="block p-2 bg-slate-400 w-full hover:bg-slate-500">Expense</Link>
          </li>
          <li className="w-full">
            <Link to="/about" className="block p-2 bg-slate-400 w-full hover:bg-slate-500">About</Link>
          </li>
          <li className="w-full">
            <Link to="/contact" className="block p-2 bg-slate-400 w-full hover:bg-slate-500">Contact</Link>
          </li>
          {/* Add more navigation links here */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;