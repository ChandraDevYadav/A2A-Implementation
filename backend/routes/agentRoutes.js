import { Router } from "express";
import { registerAgent, listAgents } from "../controllers/agentController.js";

const router = Router();
router.post("/", registerAgent);
router.get("/", listAgents);
export default router;
