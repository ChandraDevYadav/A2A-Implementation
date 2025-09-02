import axios from "axios";
import Message from "../models/Message.js";

export async function sendA2AMessage({
  toUrl,
  fromName,
  toName,
  type,
  payload,
}) {
  const msg = await Message.create({
    type,
    from: fromName,
    to: toName,
    payload,
    status: "sent",
  });
  try {
    const { data } = await axios.post(`${toUrl}/a2a/message`, {
      type,
      from: fromName,
      to: toName,
      payload,
    });
    await Message.create({
      type: data.type ?? "TaskArtifactUpdate",
      from: toName,
      to: fromName,
      payload: data.payload,
      status: "received",
    });
    return data;
  } catch (err) {
    msg.status = "error";
    msg.error = err.message;
    await msg.save();
    throw err;
  }
}
