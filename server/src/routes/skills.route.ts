import { Router } from "express";
import { addSkill, deleteSkill, getAllSkills } from "../controllers/skills";

const router = Router();

router.get("/", getAllSkills);
router.post("/", addSkill);
router.delete("/:id", deleteSkill);

export default router;
