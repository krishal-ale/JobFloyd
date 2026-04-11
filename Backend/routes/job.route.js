import express from "express";
import {
  createJob,
  updateJob,
  getAllJobs,
  getJobById,
  getJobsByEmployerId,
} from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/create-job").post(isAuthenticated, createJob);
router.route("/update-job/:id").put(isAuthenticated, updateJob);
router.route("/jobs").get(getAllJobs);
router.route("/job/:id").get(getJobById);
router.route("/employer-jobs").get(isAuthenticated, getJobsByEmployerId);

export default router;