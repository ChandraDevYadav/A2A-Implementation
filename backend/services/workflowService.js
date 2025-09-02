import { env } from "../config/env.js";
import { sendA2A } from "./a2aClient.js";
import Task from "../models/Task.js";
import { v4 as uuidv4 } from "uuid";

export async function runWorkflow(topic) {
  const task = await Task.create({ topic, status: "in_progress" });

  try {
    // 1. Niche
    const nicheMsg = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: topic }],
    };
    const nicheRes = await sendA2A({
      cardUrl: env.NICHE_AGENT_CARD,
      message: nicheMsg,
      fromName: "gateway",
    });
    const nicheText = extractTextFromResponse(nicheRes);
    task.niche = nicheText;
    await task.save();

    // 2. Vision
    const visionMsg = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: nicheText }],
    };
    const visionRes = await sendA2A({
      cardUrl: env.VISION_AGENT_CARD,
      message: visionMsg,
      fromName: "gateway",
    });
    const visionText = extractTextFromResponse(visionRes);
    task.vision = visionText;
    await task.save();

    // 3. Speaker
    const speakerMsg = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: visionText }],
    };
    const speakerRes = await sendA2A({
      cardUrl: env.SPEAKER_AGENT_CARD,
      message: speakerMsg,
      fromName: "gateway",
    });
    const identityText = extractTextFromResponse(speakerRes);
    task.identity = identityText;
    await task.save();

    // 4. Quiz
    const quizMsg = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: identityText }],
    };
    const quizRes = await sendA2A({
      cardUrl: env.QUIZ_AGENT_CARD,
      message: quizMsg,
      fromName: "gateway",
    });
    const quizText = extractTextFromResponse(quizRes);
    task.quiz = Array.isArray(quizText) ? quizText : [quizText];
    task.status = "done";
    await task.save();

    return task;
  } catch (err) {
    task.status = "error";
    await task.save();
    throw err;
  }
}

function extractTextFromResponse(res) {
  // SDK returns result/object — be flexible:
  try {
    const parts = res?.result?.parts || res?.parts || res;
    if (!parts) return typeof res === "string" ? res : JSON.stringify(res);
    const texts = Array.isArray(parts)
      ? parts
          .map((p) => p.text || (p.content && JSON.stringify(p.content)))
          .filter(Boolean)
      : [String(parts)];
    return texts.join(" ");
  } catch (e) {
    return JSON.stringify(res);
  }
}
