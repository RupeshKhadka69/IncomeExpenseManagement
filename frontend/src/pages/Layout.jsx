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
import Register from "./Register";
import GoalDetail from "../components/Goal/GoalDetail";
import AddGoal from "../components/Goal/AddGoal";

import BlogList from "../components/editor/BlogList";
import BlogForm from "../components/editor/BlogForm";
import BlogPost from "../components/editor/BlogPost";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-primary/10 dark:bg-gray-900">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[15%] flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/update/:id" element={<Register />} />
            <Route path="/income" element={<IncomeDetail />} />
            <Route path="/expense" element={<ExpenseDetail />} />
            <Route path="/budget" element={<BudgetDetail />} />
            <Route path="/goal" element={<GoalDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/expense/add-expense" element={<AddExpense />} />
            <Route path="/expense/edit-expense/:id" element={<AddExpense />} />
            <Route path="/income/add-income" element={<AddIncome />} />
            <Route path="/income/edit-income/:id" element={<AddIncome />} />
            <Route path="/budget/add-budget" element={<AddBudget />} />
            <Route path="/budget/edit-budget/:id" element={<AddBudget />} />
            <Route path="/goal/add-goal" element={<AddGoal />} />
            <Route path="/goal/edit-goal/:id" element={<AddGoal />} />
            {/* Add more routes as needed */}
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/add-blog" element={<BlogForm />} />
            <Route path="/blog/single/:id" element={<BlogPost />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
