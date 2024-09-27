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
      throw new ApiError(400, "Validation failed", validateResult.errors);
    }

    const {
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
export {
  createIncomeTransaction,
  updateIncomeTransaction,
  deleteIncomeTransaction,
};
