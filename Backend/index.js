import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRouter from './routes/user.route.js';
import companyRouter from './routes/company.route.js';
import jobRouter from './routes/job.route.js';
import applicationRouter from './routes/application.route.js';


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Routes
app.use('/jobfloyd/user', userRouter);
app.use('/jobfloyd/company', companyRouter);
app.use('/jobfloyd/job', jobRouter);
app.use('/jobfloyd/application', applicationRouter);


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