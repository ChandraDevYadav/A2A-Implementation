import Task from "../models/Task.js";
import { runWorkflow } from "../services/workflowService.js";

export const createTask = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const task = await runWorkflow(topic);
    res.status(201).json(task);
  } catch (e) {
    next(e);
  }
};

export const listTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) {
    next(e);
  }
};
