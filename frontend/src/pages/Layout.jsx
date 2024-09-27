import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ExpenseDetail from "../components/ExpenseDetail";
import AddExpense from "../components/AddExpense";
// import { SidebarContext } from "../context/SidebarContext";

const Layout = () => {
//   const { closeSidebar } = useContext(SidebarContext);
//   const [collapsed, setCollapsed] = useState(false);
//   let location = useLocation();

  // Close sidebar when route changes
//   useEffect(() => {
//     closeSidebar();
//   }, [location, closeSidebar]);

//   const handleSidebarToggle = () => {
//     setCollapsed(!collapsed);
//   };

  return (
    <div className=" h-screen bg-primary/10 dark:bg-gray-900 overflow-y-auto">
      <Header />
      <div className="grid grid-cols-[0.2fr_1fr]">
        <Sidebar  />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expense" element={<ExpenseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/add-expense" element={<AddExpense />} />

            {/* Add more routes as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Layout;
