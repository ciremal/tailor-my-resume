import { Router } from "express";
import resumeRoutes from "./resume.route";
import skillsRoutes from "./skills.route";
import experienceRoutes from "./experiences.routes";

const router = Router();

router.use("/resumes", resumeRoutes);
router.use("/skills", skillsRoutes);
router.use("/experiences", experienceRoutes);

export default router;
