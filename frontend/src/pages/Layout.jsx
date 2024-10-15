import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ExpenseDetail from "../components/Expense/ExpenseDetail";
import AddExpense from "../components/Expense/AddExpense";
import { ToastContainer } from "react-toastify";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-primary/10 dark:bg-gray-900">
      <Header />
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <div  className="w-1/6 flex-shrink-0">
        <Sidebar />

        </div>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expense" element={<ExpenseDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/expense/add-expense" element={<AddExpense />} />
            <Route path="/expense/edit-expense/:id" element={<AddExpense />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;