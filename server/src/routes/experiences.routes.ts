import { Router } from "express";
import {
  addExperience,
  deleteExperience,
  deleteMultipleExperiences,
  getExperiences,
} from "../controllers/experiences";

const router = Router();

router.get("/", getExperiences);
router.post("/", addExperience);
router.delete("/:id", deleteExperience);
router.delete("/", deleteMultipleExperiences);

export default router;
