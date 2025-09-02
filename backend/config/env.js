import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  NICHE_AGENT_URL: process.env.NICHE_AGENT_URL,
  VISION_AGENT_URL: process.env.VISION_AGENT_URL,
  SPEAKER_AGENT_URL: process.env.SPEAKER_AGENT_URL,
  QUIZ_AGENT_URL: process.env.QUIZ_AGENT_URL,
};

for (const [k, v] of Object.entries(env)) {
  if (!v) console.warn(`[env] Missing ${k}`);
}
