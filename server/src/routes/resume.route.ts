import { Router } from "express";
import {
  deleteResume,
  getAllResumes,
  uploadResume,
  updateResumeName,
} from "../controllers/resume";

const router = Router();

router.get("/", getAllResumes);
router.post("/", uploadResume);
router.delete("/:id", deleteResume);
router.patch("/:id", updateResumeName);

export default router;
