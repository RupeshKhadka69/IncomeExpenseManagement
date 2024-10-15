import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, GetPublicKeyOrSecret } from "jsonwebtoken";
import { User, IUser } from "../models/UserModel";

interface AuthRequest extends Request {
  user?: IUser;
}

const auth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json(new ApiError(401, "Unauthorized user or expired token"));
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    );

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
           res.status(401).json(new ApiError(401, "Unauthorized user or expired token"));
               return;
    }

    req.user = user;
    next();
  
});

export default auth;