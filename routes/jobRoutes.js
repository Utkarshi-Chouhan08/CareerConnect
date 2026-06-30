import express from "express";
import jobController from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, jobController.createJob);
router.get("/", jobController.getAllJobs);
router.get("/:id", jobController.getSingleJob);
router.put("/:id", protect, jobController.updateJob);
router.delete("/:id", protect, jobController.deleteJob);
export default router;