import express from "express";
import { register } from "../controllers/user.controller";
import { login } from "../controllers/user.controller";
import { logout } from "../controllers/user.controller";
import { updateProfile } from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

userRouter = express.Router();

userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/logout').post(logout);
userRouter.route('/updateProfile').post(isAuthenticated,updateProfile);

export default userRouter;

