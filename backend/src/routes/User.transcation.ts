import { Router } from "express";
import {
  createExpenseTransaction,
  updateExpenseTransaction,
  deleteExpenseTransaction,
} from "../controller/ExpenseTransaction.Controller";
import auth from "..//middleware/auth.middlerware";

const router = Router();
router.post("/create-expense",auth, createExpenseTransaction);
router.patch("/update-expense", updateExpenseTransaction);
router.delete("/delete-expense", deleteExpenseTransaction);
export default router;
