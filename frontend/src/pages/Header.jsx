import React, { useState, useContext, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminServices from "../services/AdminService";
import { ThemeContext } from "../context/ThemeProvider";
import { Moon, Sun } from "lucide-react";
import { TbExchange } from "react-icons/tb";
import { AdminContext } from "../context/AdminContext";
const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { dispatch } = useContext(AdminContext);

  const { data, refetch, isLoading } = useQuery({
    queryFn: () => AdminServices.getUserMe(),
    queryKey: ["get-user"],
    select: (d) => d?.data?.user,
    refetchOnWindowFocus: false,
  });

  const logout = async () => {
    try {
      dispatch({
        type: "USER_LOGOUT",
        // payload: { user, token: jwtToken },
      });
      await AdminServices.logout();

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: theme === "light" ? "Dark Mode" : "Light Mode",
      action: toggleTheme,
      icon:
        theme === "light" ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        ),
    },
    {
      label: "Update Profile",
      action: () => navigate(`profile/update/${data?._id}`),
      icon: <TbExchange className="w-4 h-4" />,
    },
    {
      label: "Sign out",
      action: logout,
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      ),
    },
  ];
console.log("data",data?.profile_picture)
  return (
    <header className="h-16 p-4 border-b border-gray-300 dark:border-gray-700 dark:bg-gray-800 bg-white shadow-2xl  duration-300 flex justify-between items-center transition-colors">
      <div className="text-xl font-bold text-green-800 dark:text-green-100">
        My Finance
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-green-400 dark:border-green-500 shadow-sm">
          {data?.profile_picture && (
            <img
              src={data.profile_picture}
              alt={`${data?.username}'s profile`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 text-green-800 dark:text-green-100 hover:text-green-700 dark:hover:text-green-200 transition-colors"
          >
            <span>{data?.username}</span>
            <svg
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-100 dark:border-gray-700">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.action();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
