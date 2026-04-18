import express from "express";
import {
  getDashboardStats,
  getAllEmployers,
  getAllJobSeekers,
  toggleCompanyVerification,
  deleteEmployer,
  deleteJob,
  deleteApplication,
  deleteJobSeeker,
} from "../controllers/superAdmin.controller.js";
import { isAuthenticated, isSuperAdmin } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated, isSuperAdmin);

router.get("/dashboard-stats", getDashboardStats);
router.get("/employers", getAllEmployers);
router.get("/jobseekers", getAllJobSeekers);
router.patch("/company/:companyId/toggle-verify", toggleCompanyVerification);
router.delete("/employer/:employerId", deleteEmployer);
router.delete("/job/:jobId", deleteJob);
router.delete("/application/:applicationId", deleteApplication);
router.delete("/jobseeker/:seekerId", deleteJobSeeker);

export default router;