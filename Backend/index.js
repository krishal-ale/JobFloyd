import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';
import resumeRouter from './routes/resume.route.js';
import superAdminRouter from './routes/superAdmin.route.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/jobfloyd/user', userRouter);
app.use('/jobfloyd/company', companyRouter);
app.use('/jobfloyd/job', jobRouter);
app.use('/jobfloyd/application', applicationRouter);
app.use('/jobfloyd/resume', resumeRouter);

import bcrypt from "bcrypt";
app.get("/jobfloyd/seed-admin", async (req, res) => {
  try {
    const { default: User } = await import("./models/user.model.js");
    const existing = await User.findOne({ email: "jobfloyd.app@gmail.com" });
    if (existing) {
      return res.json({ message: "Super admin already exists", success: true });
    }
    const hashedPassword = await bcrypt.hash("Hapule@202", 10);
    await User.create({
      fullName: "JobFloyd Admin",
      email: "jobfloyd.app@gmail.com",
      phoneNumber: 9999999999,
      password: hashedPassword,
      role: "employer",
      isEmailVerified: true,
      profile: { profilePicture: "" },
    });
    return res.json({ message: "Super admin created successfully!", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
});


app.use('/jobfloyd/superadmin', superAdminRouter);


const PORT = process.env.PORT || 3000;

import { setServers } from 'dns';
setServers(['8.8.8.8', '8.8.4.4']);

const startServer = async () => {
  console.log("Starting server...");
  try {
    await connectDB();
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;