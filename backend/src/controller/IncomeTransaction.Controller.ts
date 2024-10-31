import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/Transaction";
import { IUser } from "../models/UserModel";
import { ApiResponse } from "../utils/ApiResponse";
import { validateTranscation } from "../utils/ValidateTransaction";
import { ApiError } from "../utils/ApiError";
interface AuthRequest extends Request {
  user?: IUser;
}

const createIncomeTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    }

    const validateResult = validateTranscation(req.body);
    if (!validateResult.isValid) {
      return res.status(401).json(new ApiError(401, validateResult.errors));
    }

    const {
      name,
      amount,
      category,
      date,
      description,
      isRecurring,
      recurrenceInterval,
      recurrenceStartDate,
    } = req.body;

    const newTransaction = new Transaction({
      user: req.user._id,
      amount,
      name,
      type: "income",
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
          "Successfully created Income transaction"
        )
      );
  }
);
const updateIncomeTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    const validResult = validateTranscation(req.body);
    if (!validResult.isValid) {
      return res
        .status(401)
        .json(new ApiError(401, validResult.errors.join(",")));
    }
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Income Transaction id must be provided"));
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
          "Successfully updated Income transaction"
        )
      );
  }
);
const deleteIncomeTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));

    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Transaction id must be provided"));
    }
    const deleteIncomeTransaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deleteIncomeTransaction) {
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
          deleteIncomeTransaction,
          "Deleted Income successfully"
        )
      );
  }
);
const getAllIncome = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));

  const userId = req.user._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const income = await Transaction.aggregate([
    {
      $match: {
        type: "income",
        user: userId,
      },
    },
    {
      $facet: {
        incomes: [
          { $skip: skip },
          { $limit: limit },
          { $sort: { createdAt: -1 } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalIncomes = income[0].totalCount[0]?.count || 0;
  const totalPages = Math.ceil(totalIncomes / limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        incomes: income[0].incomes,
        currentPage: page,
        totalPages: totalPages,
        totalIncomes: totalIncomes,
      },
      "Fetch all incomes successfully"
    )
  );
});

// for search expense of a user
const searchIncome = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  const userId = req.user._id;

  const { search = "", sort = "createdAt", order = "desc" } = req.query;
  const searchRegex = new RegExp(search as string, "i");
  const income = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "income",
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { category: { $regex: searchRegex } },
        ],
      },
    },
    {
      $facet: {
        income: [
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

  if (income[0].income.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "no matching income found"));
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        incomes: income[0].income,
        currentPage: 1,
        totalCount: income[0].totalCount[0].count,
        totalPages: 1,
      },
      "income search fetched successfully"
    )
  );
});
// for getting single expense transaction
const getSingleIncomeTransaction = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user)
      return res.status(401).json(new ApiError(401, "Unauthorized access"));
    const { id } = req.query;
    if (!id) {
      return res
        .status(401)
        .json(new ApiError(401, "Transaction id must be provided"));
    }
    const incomeTransaction = await Transaction.findOne({
      _id: id,
      type: "income",
      user: req.user._id,
    });

    if (!incomeTransaction) {
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
        new ApiResponse(200, incomeTransaction, "fetch expense successfully")
      );
  }
);
export {
  createIncomeTransaction,
  updateIncomeTransaction,
  deleteIncomeTransaction,
  getSingleIncomeTransaction,
  searchIncome,
  getAllIncome,
};
