import { Router } from "express";
import { addSkill, getAllSkills } from "../controllers/skills";

const router = Router();

router.get("/", getAllSkills);
router.post("/", addSkill);

export default router;
