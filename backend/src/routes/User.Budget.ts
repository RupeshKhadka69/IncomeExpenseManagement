import { Router } from "express";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  getAllBudget,
  singleBuget,
  searchBudget,
} from "../controller/Budget.Controller";
import auth from "../middleware/auth.middlerware";

const router = Router();

// budget
router.post("/create-budget", auth, createBudget);
router.get("/get-all-budget", auth, getAllBudget);
router.get("/get-single-budget/:id", auth, singleBuget);
router.patch("/update-budget/:id", auth, updateBudget);
router.delete("/delete-budget/:id", auth, deleteBudget);
router.get("/search-budget", auth, searchBudget);

export default router;
