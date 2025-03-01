import { IncomeExpenseList,analyzeFinance ,generateFinancialForecast} from "../controller/Dashboard.Controller";
import { Router } from "express";
import auth from "../middleware/auth.middlerware";

const router = Router();

router.get("/income-expense-list", auth, IncomeExpenseList);
router.get("/advice", auth, analyzeFinance);
router.get("/generate-forecast", auth, generateFinancialForecast);

export default router;
