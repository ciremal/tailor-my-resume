import { Router } from "express";
import {
  addExperience,
  deleteExperience,
  getExperiences,
} from "../controllers/experiences";

const router = Router();

router.get("/", getExperiences);
router.post("/", addExperience);
router.delete("/:id", deleteExperience);
// router.patch()

export default router;
