import React from "react";
import { Link ,useLocation} from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { IoIosTrendingUp,IoIosTrendingDown } from "react-icons/io";
import { FaChartPie } from "react-icons/fa";
import { HiInformationCircle } from "react-icons/hi";
import { IoIosContact } from "react-icons/io";
const Sidebar = () => {
  const location = useLocation();
  const navigationItems = [
    { 
      path: "/", 
      name: "Dashboard", 
      icon: IoHome,
      description: "Overview of your finances"
    },
    { 
      path: "/income", 
      name: "Income", 
      icon: IoIosTrendingUp,
      description: "Track your earnings"
    },
    { 
      path: "/expense", 
      name: "Expenses", 
      icon: IoIosTrendingDown,
      description: "Manage your spending"
    },
    { 
      path: "/budget", 
      name: "Budget", 
      icon: FaChartPie,
      description: "Plan your finances"
    },
    { 
      path: "/about", 
      name: "About", 
      icon: HiInformationCircle,
      description: "Learn more about us"
    },
    { 
      path: "/contact", 
      name: "Contact", 
      icon: IoIosContact,
      description: "Get in touch"
    }
  ];
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  <IconComponent className={`w-5 h-5 ${
                    isActive 
                      ? 'text-blue-500' 
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                  }`} />
                  
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="absolute right-2 w-1.5 h-8 bg-blue-500 rounded-full" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Optional Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-500 text-center">
          &copy; 2024 MyFinance
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
