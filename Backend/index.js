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
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use('/jobfloyd/user', userRouter);
app.use('/jobfloyd/company', companyRouter);
app.use('/jobfloyd/job', jobRouter);
app.use('/jobfloyd/application', applicationRouter);
app.use('/jobfloyd/resume', resumeRouter);
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