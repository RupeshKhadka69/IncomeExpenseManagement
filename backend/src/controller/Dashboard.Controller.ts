import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/Transaction";
import BudgetModel from "../models/BudgetModel";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: IUser;
}

// helper to fetch recent transcation (upto one month)
async function fetchRecentTransaction(userId: mongoose.Types.ObjectId) {
  const currentDate = new Date();
  const oneMonthAgo = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );
  return await Transaction.find({
    user: userId,
    date: { $gte: oneMonthAgo },
  });
}

function calculateTotal(trans: any[], type: string): number {
  return trans
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}
// helper function to analyze income and expense
async function analyzeIncomeExpense(
  trans: any[],
  insights: string[],
  sugg: string[]
) {
  const totalIncome = calculateTotal(trans, "income");
  const totalExpense = calculateTotal(trans, "expense");
  const savingRate = (totalIncome - totalExpense) / totalIncome;
  if (savingRate < 0.2) {
    insights.push(
      `your saving rate is currently ${Math.round(
        savingRate * 100
      )}%, below the recommended 20%  `
    );
    sugg.push(
      `Consider reducing non-essential expense or seeking additional income. Aim for 20-30% saving rate.`
    );
  } else {
    insights.push(
      `Good job! Your savings rate is a healthy ${Math.round(
        savingRate * 100
      )}%.`
    );
  }
}
function calculateCategorySpending(trans: any[]): Record<string, number> {
  return trans.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);
}

function calculateTotalForCategory(
  transaction: any[],
  category: string,
  type: string
): number {
  return transaction
    .filter((t) => t.type === type && t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}
// helper function to analyze spending category
async function analyzeSpendingCategories(trans: any[], insights: any[]) {
  const categorySpending = calculateCategorySpending(trans);
  const topCategories = Object.entries(categorySpending)
    .sort(([, amountA], [, amountB]) => amountB - amountA)
    .slice(0, 3);
  if (topCategories.length > 0) {
    insights.push(
      `Top spending categories: ${topCategories
        .map(([category, amount]) => `${category} ($${amount.toFixed(2)})`)
        .join(", ")}`
    );
  }
}

function analyzeBudgetAdherence(
  transaction: any[],
  budgets: any[],
  insights: string[],
  suggestions: any[]
) {
  budgets.forEach((budget) => {
    const categoryExpenses = calculateTotalForCategory(
      transaction,
      budget.category,
      "expense"
    );

    if (categoryExpenses > budget.amount) {
      const overspendAmount = (categoryExpenses - budget.amount).toFixed(2);
      insights.push(
        `You've exceeded your budget for ${budget.category} by $${overspendAmount}.`
      );
      suggestions.push(
        `Consider adjusting expenses in the ${budget.category} category or reallocating funds.`
      );
    } else {
      insights.push(
        `You're within your budget for ${budget.category}. Well done!`
      );
    }
  });
}

const IncomeExpenseList = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthorize access"));
    }
    const userId = req.user._id;
    const income_expense_list = await Transaction.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $project: {
          _id: 0,
          user: 0,
          name: 0,
          category: 0,
          description: 0,
          isRecurring: 0,
          recurrenceInterval: 0,
          recurrenceStartDate: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json(new ApiResponse(200, income_expense_list));
  }
);
function addGeneralAdvice(suggestions: string[]) {
  suggestions.push(
    "Consider establishing an emergency fund for at least 3-6 months of expenses.",
    "Review your budgets regularly to adapt to any changes in income or spending patterns.",
    "Explore opportunities for income growth, such as skill development or side projects."
  );
}
const analyzeFinace = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }
  const userId = req.user._id;
  const fiveRecentTransaction = await Transaction.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: 5,
    },
  ]);
  const recentTransaction: any = await fetchRecentTransaction(userId);
  const budget = await BudgetModel.find({ user: userId });
  const insights: any[] = [];
  const suggestions: any[] = [];
  analyzeIncomeExpense(recentTransaction, insights, suggestions);
  // Analyze spending categories
  analyzeSpendingCategories(recentTransaction, insights);
  // Check budget adherence
  analyzeBudgetAdherence(recentTransaction, budget, insights, suggestions);
  // Add general financial advice
  addGeneralAdvice(suggestions);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { fiveRecentTransaction, insights, suggestions },
        "advice fetch successfully"
      )
    );
});

export { IncomeExpenseList, analyzeFinace };
