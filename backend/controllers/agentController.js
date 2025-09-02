import Agent from "../models/Agent.js";

export const registerAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (e) {
    next(e);
  }
};

export const listAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (e) {
    next(e);
  }
};
