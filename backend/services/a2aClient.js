import { A2AClient } from "@a2a-js/sdk/client";
import Message from "../models/Message.js";

export async function sendA2A({ cardUrl, message, fromName }) {
  // persist outgoing message
  const dbMsg = await Message.create({
    type: message.kind,
    from: fromName || "gateway",
    to: cardUrl,
    payload: message,
    status: "sent",
  });
  try {
    const client = await A2AClient.fromCardUrl(cardUrl);
    const res = await client.sendMessage({ message });
    // mark received artifact/message
    await Message.create({
      type: res?.kind || "TaskArtifactUpdate",
      from: cardUrl,
      to: fromName || "gateway",
      payload: res?.result || res,
      status: "received",
    });
    return res;
  } catch (err) {
    dbMsg.status = "error";
    dbMsg.error = err.message;
    await dbMsg.save();
    throw err;
  }
}
