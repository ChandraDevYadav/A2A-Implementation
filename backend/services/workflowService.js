import { env } from "../config/env.js";
import { sendA2AMessage } from "./a2aClient.js";
import Task from "../models/Task.js";

export async function runWorkflow(topic) {
  // Create task record
  const task = await Task.create({ topic, status: "in_progress" });

  // 1) Niche
  const nicheRes = await sendA2AMessage({
    toUrl: env.NICHE_AGENT_URL,
    fromName: "Gateway",
    toName: "ConsultingNicheAgent",
    type: "TaskSend",
    payload: { topic },
  });
  const niche = nicheRes.payload?.niche;
  task.niche = niche;
  await task.save();

  // 2) Vision
  const visionRes = await sendA2AMessage({
    toUrl: env.VISION_AGENT_URL,
    fromName: "Gateway",
    toName: "BusinessVisionAgent",
    type: "TaskSend",
    payload: { niche },
  });
  const vision = visionRes.payload?.vision;
  task.vision = vision;
  await task.save();

  // 3) Speaker Identity
  const identityRes = await sendA2AMessage({
    toUrl: env.SPEAKER_AGENT_URL,
    fromName: "Gateway",
    toName: "SpeakerIdentityAgent",
    type: "TaskSend",
    payload: { vision },
  });
  const identity = identityRes.payload?.identity;
  task.identity = identity;
  await task.save();

  // 4) Quiz
  const quizRes = await sendA2AMessage({
    toUrl: env.QUIZ_AGENT_URL,
    fromName: "Gateway",
    toName: "CourseQuizAgent",
    type: "TaskSend",
    payload: { identity },
  });
  const quiz = quizRes.payload?.quiz;
  task.quiz = quiz;
  task.status = "done";
  await task.save();

  return task;
}
