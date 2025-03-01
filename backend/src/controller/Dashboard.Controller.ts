import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/transaction";
import BudgetModel from "../models/BudgetModel";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";
import mongoose from "mongoose";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY, // Load from .env file
// });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AuthRequest extends Request {
  user?: IUser;
}

const DEEPSEEK_API_KEY = process.env.DEEP_SEEK_API_KEY; // Load from .env file
const DEEPSEEK_API_URL = "https://openrouter.ai/api/v1"; // Replace with actual DeepSeek API endpoint

// Function to get financial advice using DeepSeek's model
async function getFinancialAdvice(userTransactions: any[]) {
  const totalIncome = userTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = userTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const savingRate = ((totalIncome - totalExpense) / totalIncome) * 100;

  // Calculate expense breakdown by category
  const categoryExpenses = userTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Format category expenses
  const categoryBreakdown = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => (b as number) - (a as number)) // Add type assertions
    .map(
      ([category, amount]) =>
        `${category}: $${(amount as number).toFixed(2)} (${(
          ((amount as number) / totalExpense) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n  - ");

  const prompt = `
You are a personalized financial advisor. Based on the following financial data:

Financial Summary:
- Total Income: $${totalIncome.toFixed(2)}
- Total Expenses: $${totalExpense.toFixed(2)}
- Current Savings Rate: ${savingRate.toFixed(2)}%

Expense Breakdown by Category:
- ${categoryBreakdown}

Provide 3-4 specific, actionable financial advice points that are personalized to this spending pattern.
Focus on:
1. Optimizing their high-spending categories
2. Maintaining or improving their savings rate
3. Specific investment or saving strategies based on their financial situation
4. Any potential red flags in their spending pattern

Keep each point concise (1-3 sentences) and highly actionable. Format with bullet points.
`;

  const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.API_KEY,
  });
  try {
    let completion = await client.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `${prompt}`,
        },
      ],
    });
    console.log("completion", completion);
    return completion.choices[0].message.content;
    // return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error("DeepSeek API error:", error);
    return "AI is currently unavailable. Try again later!";
  }
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
    if (!budget.category) return;
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
      { $sort: { createdAt: -1 } },
      {
        $project: {
          _id: 0,
          user: 0,
          // name: 0,
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
const analyzeFinance = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  }

  const userId = req.user._id;
  const recentTransactions = await fetchRecentTransaction(userId);

  // Get user's budgets to check adherence
  const userBudgets = await BudgetModel.find({ user: userId });

  const insights: string[] = [];
  const suggestions: string[] = [];

  // Analyze income/expense and add initial insights
  await analyzeIncomeExpense(recentTransactions, insights, suggestions);

  // Analyze spending categories
  await analyzeSpendingCategories(recentTransactions, insights);

  // Check budget adherence
  if (userBudgets.length > 0) {
    analyzeBudgetAdherence(
      recentTransactions,
      userBudgets,
      insights,
      suggestions
    );
  } else {
    suggestions.push(
      "Consider setting up budgets for your main spending categories to better track your finances."
    );
  }

  // Add general financial advice even if everything looks good
  if (suggestions.length < 2) {
    addGeneralAdvice(suggestions);
  }

  // Look for unusual spending patterns
  await analyzeSpendingTrends(recentTransactions, insights, suggestions);

  // Get AI-generated financial advice
  const aiAdvice = await getFinancialAdvice(recentTransactions);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { insights, suggestions, aiAdvice },
        "Financial advice generated"
      )
    );
});

// Add this new function to analyze spending trends
async function analyzeSpendingTrends(
  transactions: any[],
  insights: string[],
  suggestions: string[]
) {
  // Group transactions by date to identify patterns
  const transactionsByDate = transactions.reduce((acc, t) => {
    const dateStr = new Date(t.date).toISOString().split("T")[0];
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(t);
    return acc;
  }, {});

  // Look for days with unusually high spending
  const dailyTotals = Object.entries(transactionsByDate).map(([date, txs]) => {
    const total = (txs as any[]).reduce(
      (sum, t) => (t.type === "expense" ? sum + t.amount : sum),
      0
    );
    return { date, total };
  });

  // Sort by total spending (highest first)
  dailyTotals.sort((a, b) => b.total - a.total);

  if (dailyTotals.length > 0 && dailyTotals[0].total > 1000) {
    insights.push(
      `You had high spending of $${dailyTotals[0].total.toFixed(2)} on ${
        dailyTotals[0].date
      }.`
    );
    suggestions.push(
      "Review your high-spending days to identify potential areas for saving."
    );
  }

  // Analyze weekend vs weekday spending
  const weekdaySpending: number[] = [];
  const weekendSpending: number[] = [];

  dailyTotals.forEach(({ date, total }) => {
    const day = new Date(date).getDay();
    if (day === 0 || day === 6) {
      // weekend (0=Sunday, 6=Saturday)
      weekendSpending.push(total);
    } else {
      weekdaySpending.push(total);
    }
  });

  const avgWeekdaySpending = weekdaySpending.length
    ? weekdaySpending.reduce((sum, amt) => sum + amt, 0) /
      weekdaySpending.length
    : 0;
  const avgWeekendSpending = weekendSpending.length
    ? weekendSpending.reduce((sum, amt) => sum + amt, 0) /
      weekendSpending.length
    : 0;

  if (avgWeekendSpending > avgWeekdaySpending * 1.5) {
    insights.push(
      `Your weekend spending ($${avgWeekendSpending.toFixed(
        2
      )}/day) is significantly higher than weekday spending ($${avgWeekdaySpending.toFixed(
        2
      )}/day).`
    );
    suggestions.push(
      "Consider planning weekend activities that are budget-friendly to reduce weekend overspending."
    );
  }
}
// Add to your controller file
const generateFinancialForecast = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    }

    const userId = req.user._id;
    const { months = 3 } = req.query; // Default 3-month forecast

    // Get recurring transactions
    const recurringTransactions = await Transaction.find({
      user: userId,
      isRecurring: true,
    });

    // Get current balance
    const allTransactions = await Transaction.find({ user: userId });
    const totalIncome = calculateTotal(allTransactions, "income");
    const totalExpense = calculateTotal(allTransactions, "expense");
    let currentBalance = totalIncome - totalExpense;

    // Project for the requested number of months
    const projections = [];
    let projectedBalance = currentBalance;

    for (let i = 1; i <= Number(months); i++) {
      const monthlyRecurringIncome = recurringTransactions
        .filter(
          (t) => t.type === "income" && t.recurrenceInterval === "monthly"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyRecurringExpense = recurringTransactions
        .filter(
          (t) => t.type === "expense" && t.recurrenceInterval === "monthly"
        )
        .reduce((sum, t) => sum + t.amount, 0);

      projectedBalance += monthlyRecurringIncome - monthlyRecurringExpense;

      // Create projection data for this month
      const projectionDate = new Date();
      projectionDate.setMonth(projectionDate.getMonth() + i);

      projections.push({
        month: projectionDate.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        projectedBalance,
        projectedIncome: monthlyRecurringIncome,
        projectedExpense: monthlyRecurringExpense,
      });
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          projections,
          "Financial forecast generated successfully"
        )
      );
  }
);

export { IncomeExpenseList, analyzeFinance, generateFinancialForecast };
