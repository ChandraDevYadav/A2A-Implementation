import Message from "../models/Message.js";

export const listMessages = async (req, res, next) => {
  try {
    const msgs = await Message.find().sort({ createdAt: -1 }).limit(200);
    res.json(msgs);
  } catch (e) {
    next(e);
  }
};
