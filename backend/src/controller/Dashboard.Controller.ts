import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import Transaction from "../models/Transaction";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";

interface AuthRequest extends Request {
  user?: IUser;
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
          name:0,
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

export { IncomeExpenseList };
