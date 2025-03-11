import { Router } from "express";
import {
  createExpenseTransaction,
  updateExpenseTransaction,
  deleteExpenseTransaction,
  getAllExpense,
  searchExpense,
  getSingleExpenseTransaction,
} from "../controller/ExpenseTransaction.Controller";
import auth from "../middleware/auth.middlerware";

import {
  createIncomeTransaction,
  updateIncomeTransaction,
  deleteIncomeTransaction,
  getAllIncome,
  searchIncome,
  getSingleIncomeTransaction,
} from "../controller/IncomeTransaction.Controller";
import {invalidateFinanceCache} from "../controller/Dashboard.Controller"

const router = Router();
// expense
router.post("/create-expense", auth, invalidateFinanceCache,createExpenseTransaction);
router.get("/get-all-expense", auth, getAllExpense);
router.get("/get-single-expense", auth, getSingleExpenseTransaction);
router.patch("/update-expense", auth,invalidateFinanceCache, updateExpenseTransaction);
router.delete("/delete-expense/:id", auth, deleteExpenseTransaction);
router.get("/search-expense", auth, searchExpense);

// income
router.post("/create-income", auth,invalidateFinanceCache, createIncomeTransaction);
router.get("/get-all-income", auth,invalidateFinanceCache, getAllIncome);
router.get("/get-single-income", auth, getSingleIncomeTransaction);
router.patch("/update-income/:id", auth, updateIncomeTransaction);
router.delete("/delete-income/:id", auth, deleteIncomeTransaction);
router.get("/search-income", auth, searchIncome);

export default router;
