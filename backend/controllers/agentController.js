import Agent from "../models/Agent.js";

export const registerAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (err) {
    next(err);
  }
};

export const listAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    next(err);
  }
};
