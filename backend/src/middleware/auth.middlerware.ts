import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response, NextFunction } from "express";
import jwt, { Secret, GetPublicKeyOrSecret, JwtPayload ,Jwt} from "jsonwebtoken";
import dotenv from "dotenv";
import { User, IUser } from "../models/UserModel";

dotenv.config();
interface AuthRequest extends Request {
    user?: IUser;
  }

const auth = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.jwtToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized user");
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    ) ;

    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Invalid token or user not found");
    }

    req.user  = user;
    next();
  } catch (error:any) {
    throw new ApiError(401, error?.message || "Invalid access token")
}

});

export default auth;