import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';
import { applyJob, getAppliedJobs, getJobApplications, updateApplicationStatus } from '../controllers/application.controller.js';


const router = express.Router();


router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get-applied-jobs").get(isAuthenticated, getAppliedJobs);
router.route("/get-job-applications/:id").get(isAuthenticated, getJobApplications);
router.route("/update-application-status/:id").post(isAuthenticated, updateApplicationStatus);




export default router;