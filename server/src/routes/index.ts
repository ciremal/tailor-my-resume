import { Router } from "express";
import resumeRoutes from "./resume.route";

const router = Router();

router.use("/resumes", resumeRoutes);

export default router;
