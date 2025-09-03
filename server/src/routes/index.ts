import { Router } from "express";
import resumeRoutes from "./resume.route";
import skillsRoutes from "./skills.route";

const router = Router();

router.use("/resumes", resumeRoutes);
router.use("/skills", skillsRoutes);

export default router;
