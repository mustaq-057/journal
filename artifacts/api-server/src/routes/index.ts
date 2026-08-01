import { Router } from "express";
import healthRouter from "./health.js";
import entriesRouter from "./entries.js";
import aiRouter from "./ai.js";
import chatRouter from "./chat.js";

const router = Router();

router.use(healthRouter);
router.use(entriesRouter);
router.use(aiRouter);
router.use(chatRouter);

export default router;
