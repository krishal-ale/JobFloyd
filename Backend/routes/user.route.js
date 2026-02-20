import express from "express";
import { register } from "../controllers/user.controller";
import { login } from "../controllers/user.controller";
import { logout } from "../controllers/user.controller";
import { updateProfile } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/updateProfile').post(isAuthenticated,updateProfile);

export default router;

