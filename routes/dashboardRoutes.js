import express from "express";
import dashboardController from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, dashboardController.getStudentDashboard);
router.get("/recruiter", protect, dashboardController.getRecruiterDashboard);

export default router;