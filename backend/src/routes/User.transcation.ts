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

const router = Router();
// expense
router.post("/create-expense", auth, createExpenseTransaction);
router.get("/get-all-expense", auth, getAllExpense);
router.get("/get-single-expense", auth, getSingleExpenseTransaction);
router.patch("/update-expense", auth, updateExpenseTransaction);
router.delete("/delete-expense/:id", auth, deleteExpenseTransaction);
router.get("/search-expense", auth, searchExpense);

// income
router.post("/create-income", auth, createIncomeTransaction);
router.get("/get-all-income", auth, getAllIncome);
router.get("/get-single-income", auth, getSingleIncomeTransaction);
router.patch("/update-income/:id", auth, updateIncomeTransaction);
router.delete("/delete-income/:id", auth, deleteIncomeTransaction);
router.get("/search-income", auth, searchIncome);

export default router;
