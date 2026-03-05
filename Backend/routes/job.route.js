import express from "express";
import { createJob, getAllJobs, getJobById, getJobsByEmployerId } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/create-job').post(isAuthenticated,createJob);
router.route('/jobs').get(isAuthenticated,getAllJobs);
router.route('/job/:id').get(isAuthenticated,getJobById);
router.route('/employer-jobs').get(isAuthenticated,getJobsByEmployerId);

export default router;