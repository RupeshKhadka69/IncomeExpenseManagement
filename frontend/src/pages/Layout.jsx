import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import ExpenseDetail from "../components/Expense/ExpenseDetail";
import AddExpense from "../components/Expense/AddExpense";
import IncomeDetail from "../components/Income/IncomeDetail";
import AddIncome from "../components/Income/AddIncome";
import BudgetDetail from "../components/Budget/BudgetDetail";
import AddBudget from "../components/Budget/AddBudget";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-primary/10 dark:bg-gray-900">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/6 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/income" element={<IncomeDetail />} />
            <Route path="/expense" element={<ExpenseDetail />} />
            <Route path="/budget" element={<BudgetDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/expense/add-expense" element={<AddExpense />} />
            <Route path="/expense/edit-expense/:id" element={<AddExpense />} />
            <Route path="/income/add-income" element={<AddIncome />} />
            <Route path="/income/edit-income/:id" element={<AddIncome />} />
            <Route path="/budget/add-budget" element={<AddBudget />} />
            <Route path="/budget/edit-budget/:id" element={<AddBudget />} />
            {/* Add more routes as needed */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
