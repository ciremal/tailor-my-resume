import { Router } from "express";
import {
  deleteResume,
  getAllResumes,
  uploadResume,
} from "../controllers/resume";

const router = Router();

router.get("/", getAllResumes);
router.post("/", uploadResume);
router.delete("/", deleteResume);

export default router;
