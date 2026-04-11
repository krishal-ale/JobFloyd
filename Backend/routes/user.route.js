import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";
import { getMe } from "../controllers/user.controller.js";

const router = express.Router();

router.route('/register').post(upload.single('file'),register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/update-profile').post(isAuthenticated, upload.single('file'), updateProfile);
router.route('/me').get(isAuthenticated, getMe);
export default router;

