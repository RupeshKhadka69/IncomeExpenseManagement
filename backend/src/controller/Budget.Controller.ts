import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import BudgetModel from "../models/BudgetModel";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/UserModel";

interface AuthRequest extends Request {
  user?: IUser;
}

const createBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }
  //   part for validation remaining

  const { BudgetName, amount, startDate, endDate, description,period } = req.body;
  const newBudget = new BudgetModel({
    user: req.user._id,
    BudgetName,
    description,
    amount,
    startDate,
    endDate,
    period,
  });
  const savedBudget = await newBudget.save();

  if (!savedBudget) {
    return res.status(400).json(new ApiError(400, "", "something went wrong"));
  }
  return res
    .status(201)
    .json(new ApiResponse(201, savedBudget, "Succesfully create budget"));
});

const updateBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }
  const { BudgetName, amount, startDate, endDate, period ,description} = req.body;
  console.log(req.body);
  const updateBudget = await BudgetModel.findOneAndUpdate(
    { _id: id, user: req.user._id },
    {
      BudgetName,
      description,
      amount,
      startDate,
      endDate,
      period,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateBudget) {
    return res
      .status(404)
      .json(
        new ApiError(
          404,
          "budget not found or you're not authorized to update it"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updateBudget,
        "Successfully updated budget transaction"
      )
    );
});

const singleBuget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }

  const Budget = await BudgetModel.findOne({
    _id: id,
    user: req.user?._id,
  });
  if (!Budget) {
    return res
      .status(401)
      .json(new ApiError(401, "buget not found or you are not authorize"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, Budget, "Fetch budget successfully"));
});

const deleteBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }

  const { id } = req.params;
  if (!id) {
    return res.status(401).json(new ApiError(401, "buget id must be provided"));
  }

  const Budget = await BudgetModel.findOneAndDelete({
    _id: id,
    user: req.user?._id,
  });
  if (!Budget) {
    return res
      .status(401)
      .json(new ApiError(401, "buget not found or you are not authorize"));
  }
  res
    .status(200)
    .json(new ApiResponse(200, Budget, "deleted budget successfully"));
});

const getAllBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorize access"));
  }
  const userId = req.user._id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const budget = await BudgetModel.aggregate([
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
        budget: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const totalBudget = budget[0].totalCount[0]?.count;
  const totalPages = Math.ceil(totalBudget / limit);

  res.status(201).json(
    new ApiResponse(201, {
      budget: budget[0].budget,
      currentPage: page,
      totalPages: totalPages,
      totalBudget: totalBudget,
    })
  );
});
const searchBudget = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user)
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  const userId = req.user._id;

  const { search = "", sort = "createdAt", order = "desc" } = req.query;
  const searchRegex = new RegExp(search as string, "i");
  const budget = await BudgetModel.aggregate([
    {
      $match: {
        user: userId,
        $or: [
          { BudgetName: { $regex: searchRegex } },
          { period: { $regex: searchRegex } },
        ],
      },
    },
    {
      $facet: {
        budget: [
          { $limit: 10 },
          { $sort: { [sort as string]: order === "desc" ? -1 : 1 } },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  if (budget[0].budget.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "no matching budget found"));
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        budget: budget[0].budget,
        currentPage: 1,
        totalBudget: budget[0].totalCount[0].count,
        totalPages: 1,
      },
      "Expenses search fetched successfully"
    )
  );
});

export {
  createBudget,
  updateBudget,
  singleBuget,
  deleteBudget,
  getAllBudget,
  searchBudget,
};
