import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, GetPublicKeyOrSecret } from "jsonwebtoken";
import { User, IUser } from "../models/UserModel";

interface AuthRequest extends Request {
  user?: IUser;
}

const auth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized user or expired token"));
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    );

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return next(new ApiError(401, "Invalid token or user not found"));
    }

    req.user = user;
    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
});

export default auth;