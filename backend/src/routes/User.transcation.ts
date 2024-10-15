import { Router } from "express";
import {
  createExpenseTransaction,
  updateExpenseTransaction,
  deleteExpenseTransaction,
  getAllExpense,
  searchExpense,
  getSingleExpenseTransaction
} from "../controller/ExpenseTransaction.Controller";
import auth from "..//middleware/auth.middlerware";

const router = Router();
router.post("/create-expense",auth, createExpenseTransaction); 
router.get("/get-all-expense", auth,getAllExpense);
router.get("/get-single-expense", auth,getSingleExpenseTransaction);
router.patch("/update-expense", auth,updateExpenseTransaction);
router.delete("/delete-expense",auth, deleteExpenseTransaction);
router.get("/search-expense",auth, searchExpense);

export default router;
