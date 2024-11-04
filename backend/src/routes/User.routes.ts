import { Router } from "express";
import {
  register,
  login,
  logout,
  getUserMe,
  refreshAccessToken,
  updateProfilePicture,
  updateUserAccount,
  changePassword,
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
export default router; 
