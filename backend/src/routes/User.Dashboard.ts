import { IncomeExpenseList,analyzeFinace } from "../controller/Dashboard.Controller";
import { Router } from "express";
import auth from "../middleware/auth.middlerware";

const router = Router();

router.get("/income-expense-list", auth, IncomeExpenseList);
router.get("/advice", auth, analyzeFinace);

export default router;
