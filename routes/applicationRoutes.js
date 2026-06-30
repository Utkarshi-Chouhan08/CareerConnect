import express from "express";
import applicationController from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applicationController.applyJob);
router.get("/my", protect, applicationController.getMyApplications);
router.get("/job/:jobId/applicants", protect, applicationController.getJobApplicants);
router.put("/:id/status", protect, applicationController.updateApplicationStatus);

export default router;