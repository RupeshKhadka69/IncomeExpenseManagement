import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/transaction";
import { IUser } from "../models/UserModel";
import { ApiResponse } from "../utils/ApiResponse";
import { validateTranscation } from "../utils/ValidateTransaction";
import { ApiError } from "../utils/ApiError";

interface AuthRequest extends Request {
  user?: IUser;
}

const createExpenseTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    }

    const validateResult = validateTranscation(req.body);
    if (!validateResult.isValid) {
      return res.status(401).json(new ApiError(401, validateResult.errors));
    }

    const {
      amount,
      name,
      category,
      date,
      description,
      isRecurring,
      recurrenceInterval,
      recurrenceStartDate,
    } = req.body;

    const newTransaction = new Transaction({
      user: req.user._id,
      name,
      amount,
      type: "expense",
      category,
      date,
      description,
      isRecurring,
      recurrenceInterval,
      recurrenceStartDate,
    });

    const savedTranscation = await newTransaction.save();

    return res
      .status(201) // Changed to 201 for resource creation
      .json(
        new ApiResponse(
          201,
          savedTranscation,
          "Successfully created Expenses transaction"
        )
      );
  }
);
const updateExpenseTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    const validResult = validateTranscation(req.body);
    if (!validResult.isValid) {
      return res
        .status(401)
        .json(new ApiError(401, validResult.errors.join(",")));
    }
    const { id } = req.query;
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Expense Transaction id must be provided"));
    }
    const {
      amount,
      name,
      category,
      date,
      description,
      isRecurring,
      recurrenceInterval,
      recurrenceStartDate,
    } = req.body;

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        amount,
        name,
        category,
        date,
        description,
        isRecurring,
        recurrenceInterval,
        recurrenceStartDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedTransaction) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Transaction not found or you're not authorized to update it"
          )
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedTransaction,
          "Successfully updated expense transaction"
        )
      );
  }
);

// for getting single expense transaction
const getSingleExpenseTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    const { id } = req.query;
    console.log("id",id);
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Transaction id must be provided"));
    }
    const expenseTransaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!expenseTransaction) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Transaction not found or you're not authorized to view it"
          )
        );
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, expenseTransaction, "fetch expense successfully")
      );
  }
);
const deleteExpenseTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));

    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Transaction id must be provided"));
    }
    const deleteExpenseTransaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deleteExpenseTransaction) {
      return res
        .status(404)
        .json(
          new ApiError(
            404,
            "Transaction not found or you're not authorized to delete it"
          )
        );
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteExpenseTransaction,
          "Deleted expense successfully"
        )
      );
  }
);

const getAllExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));

  const userId = req.user._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const expense = await Transaction.aggregate([
    {
      $match: {
        type: "expense",
        user: userId,
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        expenses: [
          { $skip: skip },
          { $limit: limit },
          
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalExpenses = expense[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalExpenses / limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses: expense[0].expenses,
        currentPage: page,
        totalPages: totalPages,
        totalExpenses: totalExpenses,
      },
      "Fetch all expenses successfully"
    )
  );
});

// for search expense of a user
const searchExpense = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  const userId = req.user._id;

  const { search = "", sort = "createdAt", order = "desc" } = req.query;
  const searchRegex = new RegExp(search as string, "i");
  const expenses = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "expense",
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      },
    },
    {
      $facet: {
        expenses: [
          { $limit: 10 },
          { $sort: { [sort as string]: order === "desc" ? -1 : 1 } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },

    // {
    //   $limit: 10,
    // },
  ]);

  if (expenses[0].expenses.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "no matching expenses found"));
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses: expenses[0].expenses,
        currentPage: 1,
        totalCount: expenses[0].totalCount[0].count,
        totalPages: 1,
      },
      "Expenses search fetched successfully"
    )
  );
});

export {
  createExpenseTransaction,
  updateExpenseTransaction,
  deleteExpenseTransaction,
  getAllExpense,
  searchExpense,
  getSingleExpenseTransaction
};
