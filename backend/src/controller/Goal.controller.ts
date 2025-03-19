import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";
import GoalModel from "../models/GoalModel";
import BudgetModel from "../models/BudgetModel"

interface AuthRequest extends Request {
  user?: IUser;
}

const createGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }
  //   part for validation remaining

  const { name, targetAmount, currentAmount, deadline } = req.body;
  const newGoal = new GoalModel({
    user: req.user._id,
    name,
    targetAmount,
    currentAmount,
    deadline,
  });
  const savedGoal = await newGoal.save();

  if (!savedGoal) {
    return res.status(400).json(new ApiError(400, "", "something went wrong"));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, savedGoal, "Succesfully create Goal"));
});

const updateGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }
  const { name, targetAmount, currentAmount, deadline } = req.body;
  console.log(req.body);
  const updateGoal = await GoalModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    {
        name,
        targetAmount,
        currentAmount,
        deadline,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateGoal) {
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          "Goal not found or you're not authorized to update it"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateGoal,
        "Successfully updated Goal transaction"
      )
    );
});

const singleGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }

  const Goal = await GoalModel.findOne({
    _id: id,
    user: req.user?._id,
  });
  if (!Goal) {
    return res
      .status(401)
      .json(new ApiError(401, "buget not found or you are not authorize"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, Goal, "Fetch Goal successfully"));
});

const deleteGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }

  const Goal = await GoalModel.findOneAndDelete({
    _id: id,
    user: req.user?._id,
  });
  if (!Goal) {
    return res
      .status(401)
      .json(new ApiError(401, "buget not found or you are not authorize"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, Goal, "deleted Goal successfully"));
});

const getAllGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }
  const userId = req.user._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const Goal = await GoalModel.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $facet: {
        Goal: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalGoal = Goal[0].totalCount[0]?.count;
  const totalPages = Math.ceil(totalGoal / limit);

  res.status(201).json(
    new ApiResponse(201, {
      Goal: Goal[0].Goal,
      currentPage: page,
      totalPages: totalPages,
      totalGoal: totalGoal,
    })
  );
});
const searchGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  const userId = req.user._id;

  const { search = "", sort = "createdAt", order = "desc" } = req.query;
  const searchRegex = new RegExp(search as string, "i");
  const Goal = await GoalModel.aggregate([
    {
      $match: {
        user: userId,
        $or: [
          { name: { $regex: searchRegex } },
        ],
      },
    },
    {
      $facet: {
        Goal: [
          { $limit: 10 },
          { $sort: { [sort as string]: order === "desc" ? -1 : 1 } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  if (Goal[0].Goal.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "no matching Goal found"));
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        Goal: Goal[0].Goal,
        currentPage: 1,
        totalGoal: Goal[0].totalCount[0].count,
        totalPages: 1,
      },
      "Expenses search fetched successfully"
    )
  );
});


const GoalsAndBugetList = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    }
    
    const userId = req.user._id;
    
    // Fetch all goals for the user
    const goals = await GoalModel.find({ user: userId }).select('name targetAmount currentAmount deadline');
    
    // Fetch all budgets for the user
    const budgets = await BudgetModel.find({ user: userId }).select('BudgetName amount startDate endDate period');
    
    // Format data for line chart
    const chartData = {
      goals: goals.map(goal => ({
        id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        progress: (goal.currentAmount / goal.targetAmount) * 100
      })),
      budgets: budgets.map(budget => ({
        id: budget._id,
        name: budget.BudgetName,
        amount: budget.amount,
        startDate: budget.startDate,
        endDate: budget.endDate,
        period: budget.period
      })),
      // Calculate some summary statistics
      summary: {
        totalGoals: goals.length,
        totalBudgets: budgets.length,
        totalGoalAmount: goals.reduce((sum, goal) => sum + goal.targetAmount, 0),
        totalBudgetAmount: budgets.reduce((sum, budget) => sum + budget.amount, 0),
        averageGoalProgress: goals.length > 0 
          ? goals.reduce((sum, goal) => sum + ((goal.currentAmount / goal.targetAmount) * 100), 0) / goals.length 
          : 0
      }
    };
    
    return res
      .status(200)
      .json(new ApiResponse(200, chartData, "Goals and Budgets data fetched successfully"));
  });
  

export {
  createGoal,
  updateGoal,
  singleGoal,
  deleteGoal,
  getAllGoal,
  searchGoal,
  GoalsAndBugetList,
};
