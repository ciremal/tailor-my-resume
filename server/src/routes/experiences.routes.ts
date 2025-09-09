import { Router } from "express";
import { addExperience, getExperiences } from "../controllers/experiences";

const router = Router();

router.get("/", getExperiences);
router.post("/", addExperience);
// router.patch()
// router.delete()

export default router;
