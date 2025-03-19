import { Router } from "express";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  getAllGoal,
  singleGoal,
  searchGoal,
  GoalsAndBugetList
} from "../controller/Goal.controller";
import auth from "../middleware/auth.middlerware";

const router = Router();

// Goal
router.post("/create-goal", auth, createGoal);
router.get("/get-all-goal", auth, getAllGoal);
router.get("/get-single-goal/:id", auth, singleGoal);
router.patch("/update-goal/:id", auth, updateGoal);
router.delete("/delete-goal/:id", auth, deleteGoal);
router.get("/search-goal", auth, searchGoal);
router.get("/goals-budget-list", auth, GoalsAndBugetList);

export default router;
