import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/transaction";
import BudgetModel from "../models/BudgetModel";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";
import mongoose, { DataSizeOperatorReturningNumber } from "mongoose";
import OpenAI from "openai";
import NodeCache from "node-cache";
import dotenv from "dotenv";
dotenv.config();

// Initialize cache with 30 minute TTL default
const financeCache = new NodeCache({ stdTTL: 1800, checkperiod: 600 });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface AuthRequest extends Request {
  user?: IUser;
}

interface ProcessedData {
  totalIncome: number;
  totalExpense: number;
  savingRate: number;
  categorySpending: Record<string, number>;
  topCategories: [string, number][];
  avgWeekdaySpending: number;
  avgWeekendSpending: number;
  highestDailySpending: { date: string; total: number };
}

// Cache key generator
const getCacheKey = (userId: mongoose.Types.ObjectId, action: string) => {
  return `${userId.toString()}_${action}`;
};

// Function to get financial advice using AI
async function getFinancialAdvice(userTransactions: any[]) {
  // Try to get from cache first
  const cacheKey = `ai_advice_${JSON.stringify(
    userTransactions.map((t) => ({
      id: t._id.toString(),
      amount: t.amount,
      type: t.type,
      category: t.category,
    }))
  )}`;

  const cachedAdvice = financeCache.get(cacheKey);
  if (cachedAdvice) {
    return cachedAdvice as string;
  }

  const totalIncome = userTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = userTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const savingRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  // Calculate expense breakdown by category
  const categoryExpenses = userTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  // Format category expenses
  const categoryBreakdown = Object.entries(categoryExpenses)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(
      ([category, amount]) =>
        `${category}: Rs${(amount as number).toFixed(2)} (${(
          ((amount as number) / totalExpense) *
          100
        ).toFixed(1)}%)`
    )
    .join("\n  - ");

  const prompt = `
You are a friendly money advisor. Based on this person's spending:

Summary:
- Income: Rs${totalIncome.toFixed(2)}
- Expenses: Rs${totalExpense.toFixed(2)}
- Savings Rate: ${savingRate.toFixed(1)}%

Where money goes:
- ${categoryBreakdown}

Give 3-4 simple, practical money tips. Use everyday language that's easy to understand. Focus on:
1. How to spend less in categories where they spend the most
2. Simple ways to save more money
3. Basic advice for their financial situation
4. Point out any spending problems you notice

Keep each tip short (1-2 simple sentences). Use bullet points.
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
          content: prompt,
        },
      ],
    });

    const advice = completion.choices[0].message.content;

    // Cache the advice for 1 hour
    financeCache.set(cacheKey, advice, 3600);

    return advice;
  } catch (error) {
    console.error("AI advice error:", error);
    return "Sorry, money tips aren't available right now. Please try again later!";
  }
}

// Helper to fetch recent transactions (up to one month)
async function fetchRecentTransaction(userId: mongoose.Types.ObjectId) {
  const cacheKey = getCacheKey(userId, "recent_transactions");

  // Try to get from cache first
  const cachedTransactions = financeCache.get(cacheKey);
  if (cachedTransactions) {
    return cachedTransactions as any[];
  }

  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: oneMonthAgo },
  }).lean();

  // Cache for 15 minutes
  financeCache.set(cacheKey, transactions, 900);

  return transactions;
}

// Process all transaction data efficiently
function processTransactionData(transactions: any[]): ProcessedData {
  const processingStartTime = Date.now();

  // Reduce over the transactions array just once
  const {
    totalIncome,
    totalExpense,
    categorySpending,
    dailySpending,
    weekdaySpending,
    weekendSpending,
  } = transactions.reduce(
    (acc, t) => {
      // Process income/expense totals
      if (t.type === "income") {
        acc.totalIncome += t.amount;
      } else if (t.type === "expense") {
        acc.totalExpense += t.amount;

        // Process category data
        acc.categorySpending[t.category] =
          (acc.categorySpending[t.category] || 0) + t.amount;

        // Process date-based data
        const date = new Date(t.date);
        const dateStr = date.toISOString().split("T")[0];
        acc.dailySpending[dateStr] =
          (acc.dailySpending[dateStr] || 0) + t.amount;

        // Process day of week
        const day = date.getDay();
        if (day === 0 || day === 6) {
          acc.weekendSpending.push(t.amount);
        } else {
          acc.weekdaySpending.push(t.amount);
        }
      }

      return acc;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
      categorySpending: {} as Record<string, number>,
      dailySpending: {} as Record<string, number>,
      weekdaySpending: [] as number[],
      weekendSpending: [] as number[],
    }
  );

  // Calculate saving rate
  const savingRate =
    totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;

  // Sort categories by spending (only once)
  const topCategories: any = Object.entries(categorySpending)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3);

  // Calculate averages
  const avgWeekdaySpending =
    weekdaySpending.length > 0
      ? weekdaySpending.reduce((sum: number, amt: number) => sum + amt, 0) /
        weekdaySpending.length
      : 0;

  const avgWeekendSpending =
    weekendSpending.length > 0
      ? weekendSpending.reduce((sum: number, amt: number) => sum + amt, 0) /
        weekendSpending.length
      : 0;

  const sortedDailyTotals = Object.entries(dailySpending)
    .map(([date, total]) => ({ date, total: total as number }))
    .sort((a, b) => b.total - a.total);

  console.log(`Processing completed in ${Date.now() - processingStartTime}ms`);

  return {
    totalIncome,
    totalExpense,
    savingRate,
    categorySpending,
    topCategories,
    avgWeekdaySpending,
    avgWeekendSpending, // Note: fixed typo 'avgWeekendSupending'
    highestDailySpending: sortedDailyTotals[0] || { date: "", total: 0 },
  };
}

// Check budget adherence
function checkBudgetAdherence(
  categorySpending: Record<string, number>,
  budgets: any[],
  insights: string[],
  suggestions: string[]
) {
  budgets.forEach((budget: any) => {
    if (!budget.category) return;

    const categoryExpense = categorySpending[budget.category] || 0;

    if (categoryExpense > budget.amount) {
      const overspendAmount = (categoryExpense - budget.amount).toFixed(2);
      insights.push(
        `You've exceeded your budget for ${budget.category} by Rs${overspendAmount}.`
      );
      suggestions.push(
        `Consider cutting back on ${budget.category} expenses or updating your budget.`
      );
    } else {
      insights.push(
        `You're within your budget for ${budget.category}. Well done!`
      );
    }
  });
}

// Analyze spending patterns
function analyzeSpendingPatterns(
  data: ProcessedData,
  insights: string[],
  suggestions: string[]
) {
  // Check for high spending days
  if (data.highestDailySpending.total > 1000) {
    insights.push(
      `You had high spending of Rs${data.highestDailySpending.total.toFixed(
        2
      )} on ${data.highestDailySpending.date}.`
    );
    suggestions.push(
      "Review your high-spending days to identify potential areas for saving."
    );
  }

  // Compare weekend vs weekday spending
  if (data.avgWeekendSpending > data.avgWeekdaySpending * 1.5) {
    insights.push(
      `Your weekend spending (Rs${data.avgWeekendSpending.toFixed(
        2
      )}/day) is much higher than weekday spending (Rs${data.avgWeekdaySpending.toFixed(
        2
      )}/day).`
    );
    suggestions.push("Try planning more budget-friendly weekend activities.");
  }
}

// Add general advice
function addGeneralAdvice(suggestions: string[]) {
  suggestions.push(
    "Consider establishing an emergency fund for at least 3-6 months of expenses.",
    "Review your budgets regularly to adapt to any changes in income or spending patterns.",
    "Explore opportunities for income growth, such as skill development or side projects."
  );
}

// Optimized analyze finance endpoint
const analyzeFinance = asyncHandler(async (req: AuthRequest, res: Response) => {
  const startTime = Date.now();

  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  }

  const userId = req.user._id;

  // Check if we have a cached analysis result
  const cacheKey = getCacheKey(userId, "finance_analysis");
  const cachedAnalysis = financeCache.get(cacheKey);

  if (cachedAnalysis) {
    console.log(
      `Using cached finance analysis (took ${Date.now() - startTime}ms)`
    );
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          cachedAnalysis,
          "Financial advice generated (cached)"
        )
      );
  }

  console.log("Cache miss, generating fresh analysis");

  // Fetch data in parallel
  const [recentTransactions, userBudgets] = await Promise.all([
    fetchRecentTransaction(userId),
    BudgetModel.find({ user: userId }).lean(),
  ]);

  // Process transactions - efficient, single-pass operation
  const processedData = processTransactionData(recentTransactions);

  // Generate insights and suggestions based on processed data
  const insights: string[] = [];
  const suggestions: string[] = [];

  // Add savings rate insights
  if (processedData.savingRate < 0.2) {
    insights.push(
      `Your saving rate is currently ${Math.round(
        processedData.savingRate * 100
      )}%, below the recommended 20%`
    );
    suggestions.push(
      `Consider reducing non-essential expenses or finding additional income. Aim for 20-30% savings.`
    );
  } else {
    insights.push(
      `Good job! Your savings rate is a healthy ${Math.round(
        processedData.savingRate * 100
      )}%.`
    );
  }

  // Add top spending categories
  if (processedData.topCategories.length > 0) {
    insights.push(
      `Top spending categories: ${processedData.topCategories
        .map(
          ([category, amount]) =>
            `${category} (Rs${(amount as number).toFixed(2)})`
        )
        .join(", ")}`
    );
  }

  // Check budget adherence
  if (userBudgets.length > 0) {
    checkBudgetAdherence(
      processedData.categorySpending,
      userBudgets,
      insights,
      suggestions
    );
  } else {
    suggestions.push(
      "Consider setting up budgets for your main spending categories to better track your finances."
    );
  }

  // Add general advice if needed
  if (suggestions.length < 2) {
    addGeneralAdvice(suggestions);
  }

  // Analyze spending trends
  analyzeSpendingPatterns(processedData, insights, suggestions);

  // Get AI advice with a timeout to prevent long waits
  let aiAdvice: string;
  try {
    // Set a timeout for the AI advice to prevent long waits
    const timeoutPromise = new Promise<string>((_, reject) => {
      setTimeout(() => reject(new Error("AI advice timed out")), 200000);
    });

    const advicePromise = getFinancialAdvice(recentTransactions);
    aiAdvice = (await Promise.race([advicePromise, timeoutPromise])) as string;
  } catch (error) {
    console.error("Error getting AI advice:", error);
    aiAdvice =
      "AI tips currently unavailable. Here are our standard suggestions.";
  }

  // Create the final response
  const analysisResult = { insights, suggestions, aiAdvice };

  // Cache the result for 15 minutes
  financeCache.set(cacheKey, analysisResult, 900);

  const elapsedTime = Date.now() - startTime;
  console.log(`Finance analysis completed in ${elapsedTime}ms`);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analysisResult,
        `Financial advice generated in ${elapsedTime}ms`
      )
    );
});

// Cache invalidation middleware for when transactions change
const invalidateFinanceCache = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      const userId = req.user._id;
      const recentTransactionsKey = getCacheKey(userId, "recent_transactions");
      const financeAnalysisKey = getCacheKey(userId, "finance_analysis");

      // Delete the cached analyses
      financeCache.del(recentTransactionsKey);
      financeCache.del(financeAnalysisKey);

      console.log(`Cache invalidated for user ${userId}`);
    }
    next();
  }
);

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
function calculateTotal(trans: any[], type: string): number {
  return trans
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}
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
export {
  IncomeExpenseList,
  analyzeFinance,
  generateFinancialForecast,
  invalidateFinanceCache,
};
