import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized User", success: false });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid Token", success: false });
    }
    req.id = decoded.id;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorized User", success: false });
  }
};

export const isSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.id);
    if (!user || user.email !== "jobfloyd.app@gmail.com") {
      return res
        .status(403)
        .json({ message: "Access denied. Super Admin only.", success: false });
    }
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ message: "Access denied.", success: false });
  }
};