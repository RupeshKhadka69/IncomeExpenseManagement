import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User, IUser } from "../models/UserModel";
import { uploadOnCloudinary } from "../utils/Cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { ObjectId, set } from "mongoose";
import auth from "../middleware/auth.middlerware";
import jwt, { GetPublicKeyOrSecret, Secret } from "jsonwebtoken";
import { sendMail, forgotPasswordMailgenContent } from "../utils/SendMail";
import crypto from "crypto";
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
    return res
      .status(200)
      .json(new ApiError(400, "", "user doesnot exits with this email"));
  }
  const isPasswordCorrect = await isUser.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiError(401, "", "Password is incorrect"));
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
const refreshAccessToken = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const token =
      req.cookies.refreshToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      res
        .status(401)
        .json(new ApiError(401, "Unauthorized: No token provided"));
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
        throw new ApiError(
          401,
          "Unauthorized: Refresh token is invalid or expired"
        );
      }
      const { jwtToken, refreshToken } = await generateJwtAndRefreshToken(
        user._id as mongoose.Types.ObjectId
      );
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure this is only true in production
      };
      res
        .status(200)
        .cookie("jwtToken", jwtToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(
            200,
            { jwtToken, refreshToken },
            "Access token refreshed successfully"
          )
        );
    } catch (error) {
      throw new ApiError(401, "Error while refreshing access token");
    }
  }
);

const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
  res
    .status(200)
    .clearCookie("jwtToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logout successfully"));
});
const getUserMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Unauthorized access"));
  }
  const { jwtToken } = await generateJwtAndRefreshToken(
    req.user._id as mongoose.Types.ObjectId
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: req?.user, jwtToken },
        "User Fetched successfully"
      )
    );
});

const updateUserAccount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { username, email } = req.body;

    // Get the profile picture file from the correct field name
    const profileFile = req.files && (req.files as any)["profile_picture"]?.[0];

    let uploadedImageToCloudinary;

    if (profileFile) {
      try {
        uploadedImageToCloudinary = await uploadOnCloudinary(profileFile.path);

        if (!uploadedImageToCloudinary?.url) {
          throw new ApiError(
            400,
            "Error while uploading profile picture to cloudinary"
          );
        }
      } catch (error) {
        throw new ApiError(400, "Failed to upload image to cloudinary");
      }
    }

    if (!username || !email) {
      throw new ApiError(400, "Username and email are required");
    }

    // Create update object
    const updateData: any = {
      username,
      email,
    };

    // Only add profile_picture to update if we have a new one
    if (uploadedImageToCloudinary?.url) {
      updateData.profile_picture = uploadedImageToCloudinary.url;
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: updateData,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User updated successfully"));
  }
);
const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword && !newPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "", "Both old and new Password required"));
  }
  const user = await User.findById(req.user?._id);
  if (!user)
    return res.status(400).json(new ApiError(400, "", "Unauthorized access"));
  const isPasswordCorrect = await user?.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "", "Password is incorrect"));
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
const forgotPasswordRequest = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    // Get email from the client and check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(new ApiError(401, null, "No email found"));
    }

    // Generate a temporary token
    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken(); // generate password reset creds
    console.log("unHashedToken", unHashedToken);
    console.log("hashedToken", hashedToken);
    console.log("tokenExpiry", tokenExpiry);
    // save the hashed version a of the token and expiry in the DB
    user.forgotPasswordToken = hashedToken;
    console.log("user.forgotPasswordToken", user.forgotPasswordToken);
    user.forgotPasswordExpiry = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    // Send mail with the password reset link. It should be the link of the frontend url with token
    await sendMail({
      email: user?.email,
      subject: "Password reset request",
      mailgenContent: forgotPasswordMailgenContent(
        user.username,
        // ! NOTE: Following link should be the link of the frontend page responsible to request password reset
        // ! Frontend will send the below token with the new password in the request body to the backend reset password endpoint
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
      ),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "Password reset mail has been sent on your mail id"
        )
      );
  }
);
const resetForgottenPassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // Create a hash of the incoming reset token

    let hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // See if user with hash similar to resetToken exists
    // If yes then check if token expiry is greater than current date

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });
    console.log("user", user);

    // If either of the one is false that means the token is invalid or expired
    if (!user) {
      throw new ApiError(489, "Token is invalid or expired");
    }

    // if everything is ok and token id valid
    // reset the forgot password token and expiry
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    // Set the provided password as the new password
    user.password = newPassword;
     await user.save({ validateBeforeSave: false });
    const { jwtToken, refreshToken } = await generateJwtAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("jwtToken", jwtToken, options) // set the access token in the cookie
      .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
      .json(new ApiResponse(200,{user,jwtToken}, "Password reset successfully"));
  }
);

const handleSocialLogin = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      console.log("user not found");
      throw new ApiError(404, "User does not exist");
    }

    const { jwtToken, refreshToken } = await generateJwtAndRefreshToken(
      user._id
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(301)
      .cookie("jwtToken", jwtToken, options) // set the access token in the cookie
      .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
      .redirect(
        // redirect user to the frontend with access and refresh token in case user is not using cookies
        `${process.env.CLIENT_SSO_REDIRECT_URL}`
      );
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
  changePassword,
  handleSocialLogin,
  forgotPasswordRequest,
  resetForgottenPassword,
};
