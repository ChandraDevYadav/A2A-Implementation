import { Router } from "express";
import { createTask, listTasks } from "../controllers/taskController.js";

const router = Router();

router.post("/", createTask);
router.get("/", listTasks);

export default router;
