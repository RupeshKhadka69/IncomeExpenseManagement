import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User, IUser } from "../models/UserModel";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { ObjectId, set } from "mongoose";
import auth from "../middleware/auth.middlerware";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: IUser;
}
const generateJwtAndRefreshToken = async (userId: mongoose.Types.ObjectId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const jwtToken = user.generateJwtToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: true });

    return { jwtToken, refreshToken };
  } catch (err) {
    throw new ApiError(400, "something went wrong while generating token");
  }
};
const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      [username, email, password].some((field) => field.trim() === "")
    ) {
      throw new ApiError(400, "Username, email, and password are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      throw new ApiError(
        400,
        "User already exists with this username or email"
      );
    }

    let local_profile_picture = "";
    if (req.files && "profile_picture" in req.files) {
      const file = (req.files as any).profile_picture[0];
      local_profile_picture = file.path;
    }

    let profile_picture_url = "";
    if (local_profile_picture) {
      const uploadedImage = await uploadOnCloudinary(local_profile_picture);
      if (uploadedImage) {
        profile_picture_url = uploadedImage.secure_url;
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      profile_picture: profile_picture_url,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong in registering the user");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "Successfully registered user"));
  }
);
const login = asyncHandler(async (req: Request, res: Response) => {
  // get data -> validata data -> find user -> check password -> access and refresh token -> send cookie and data
  const { email, password } = req.body;
  if (!email && !password) {
    throw new ApiError(400, "email and password is required");
  }
  const isUser = await User.findOne({ email });
  if (!isUser) {
    throw new ApiError(400, "user doesnot exits with this email");
  }
  const isPasswordCorrect = await isUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
  throw  new ApiError(400, "incorrect password");
  }

  const { jwtToken, refreshToken } = await generateJwtAndRefreshToken(
    isUser._id as mongoose.Types.ObjectId
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  const loggedInUser = await User.findById(isUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("jwtToken", jwtToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, jwtToken, refreshToken },
        "user logged in successfully"
      )
    );
});
const refreshAccessToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const token = req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized: No token provided");
  }
  try {
    const decodedToken: any = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret | GetPublicKeyOrSecret
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Unauthorized: User not found");
    }
    if (token !== user.refreshToken) {
      throw new ApiError(401, "Unauthorized: Refresh token is invalid or expired");
    }
    const { jwtToken, refreshToken } = await generateJwtAndRefreshToken(user._id as mongoose.Types.ObjectId);
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure this is only true in production
    };
    res
      .status(200)
      .cookie("jwtToken", jwtToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { jwtToken, refreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, "Error while refreshing access token");
  }
});

const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("jwtToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});
const getUserMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req?.user, "User Fetched successfully"));
});

const updateUserAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { username, email } = req.body;
    if (!username || !email) {
      throw new ApiError(401, "fields are empty");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          username,
          email,
        },
      },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "user updated succesfully"));
  }
);
const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword && !newPassword) {
    throw new ApiError(400, "Both old and new Password required");
  }
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(400, "no user found");
  const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is not correct");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "Password change successfully"));
});
const updateProfilePicture = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const profileLocalPath = req.file?.path;
    if (!profileLocalPath)
      throw new ApiError(401, "Profile picture is missing");

    const uploadedImageToCloudinary = await uploadOnCloudinary(
      profileLocalPath
    );
    if (!uploadedImageToCloudinary?.url) {
      throw new ApiError(
        400,
        "Error while uploading profile picture to cloudinary"
      );
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profile_picture: uploadedImageToCloudinary.url,
        },
      },
      {
        new: true,
      }
    ).select("-password");
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Profile picture updated succesfully"));
  }
);

export {
  register,
  login,
  logout,
  getUserMe,
  refreshAccessToken,
  updateUserAccount,
  updateProfilePicture,
  changePassword
};
