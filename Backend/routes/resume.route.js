import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  createResume,
  getMyResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, createResume);
router.get("/", isAuthenticated, getMyResumes);
router.get("/:id", isAuthenticated, getResumeById);
router.put("/:id", isAuthenticated, updateResume);
router.delete("/:id", isAuthenticated, deleteResume);

export default router;