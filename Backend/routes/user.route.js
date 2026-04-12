import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  login,
  logout,
  updateProfile,
  getMe,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/send-register-otp").post(upload.single("file"), sendRegisterOtp);
router.route("/verify-register-otp").post(verifyRegisterOtp);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/update-profile").post(isAuthenticated, upload.single("file"), updateProfile);
router.route("/me").get(isAuthenticated, getMe);

export default router;