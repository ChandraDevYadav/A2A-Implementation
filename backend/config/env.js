import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || "",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  NICHE_AGENT_CARD: process.env.NICHE_AGENT_CARD,
  VISION_AGENT_CARD: process.env.VISION_AGENT_CARD,
  SPEAKER_AGENT_CARD: process.env.SPEAKER_AGENT_CARD,
  QUIZ_AGENT_CARD: process.env.QUIZ_AGENT_CARD,
};

for (const [k, v] of Object.entries(env)) {
  if (!v) console.warn(`[env] ${k} is not set`);
}
