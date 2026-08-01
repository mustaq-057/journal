import { Router, type IRouter } from "express";
import healthRouter from "./health";
import entriesRouter from "./entries";
import aiRouter from "./ai";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(entriesRouter);
router.use(aiRouter);
router.use(chatRouter);

export default router;
