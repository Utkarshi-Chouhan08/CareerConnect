import express from "express";
import userController from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);
router.post(
  "/upload-resume",
  protect,
  upload.single("resume"),
  userController.uploadResume
);

export default router;