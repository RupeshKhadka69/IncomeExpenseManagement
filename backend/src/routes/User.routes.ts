import { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  getUserMe,
  refreshAccessToken,
  updateProfilePicture,
  updateUserAccount,
  changePassword,
  handleSocialLogin,
  forgotPasswordRequest,
  resetForgottenPassword,

} from "../controller/User.Controller";
import { upload } from "../middleware/multer.middleware";
import auth from "../middleware/auth.middlerware";
const router = Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "profile_picture",
      maxCount: 1,
    },
  ]),
  register
);
router.post("/login", login);
router.post("/logout", auth, logout);
router.patch(
  "/update-account",
  auth,
  upload.fields([
    {
      name: "profile_picture",
      maxCount: 1,
    },
  ]),
  updateUserAccount
);
router.patch("/change-password", auth, changePassword);
router.patch(
  "/profile-picture",
  auth,
  upload.single("profile_picture"),
  updateProfilePicture
);
router.get("/me", auth, getUserMe);
router.post("/refresh-token", auth, refreshAccessToken);

router.route("/forgot-password").post(
  // userForgotPasswordValidator(),
  forgotPasswordRequest
);
router.route("/reset-password/:resetToken").post(
  // userResetForgottenPasswordValidator(),
  // auth,
  resetForgottenPassword
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  (req, res) => {
    res.status(200).json({
      message: "Google login route",
    });
  }
);
router.get(
  "/google/callback",
  passport.authenticate("google"),
  handleSocialLogin
);

export default router;
