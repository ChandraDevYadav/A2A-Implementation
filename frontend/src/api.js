// src/api.js
const BASE_URLS = {
  niche: "http://localhost:4000/api/niche",
  vision: "http://localhost:4000/api/vision",
  speaker: "http://localhost:4000/api/speaker",
  quiz: "http://localhost:4000/api/quiz",
};

async function callAgent(agent, endpoint, method = "POST", body = {}) {
  const url = `${BASE_URLS[agent]}${endpoint}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "GET" ? undefined : JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error from ${agent}: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.error(`Failed to call ${agent} agent:`, err);
    throw err;
  }
}

export const api = {
  niche: {
    generateIdeas: (topic) =>
      callAgent("niche", "/generate", "POST", { topic }),
  },
  vision: {
    analyzeImage: (imageUrl) =>
      callAgent("vision", "/analyze", "POST", { imageUrl }),
  },
  speaker: {
    generateSpeech: (text) => callAgent("speaker", "/speak", "POST", { text }),
  },
  quiz: {
    generateQuizFromText: (text) =>
      callAgent("quiz", "/generate-quiz", "POST", { text }),
    generateQuizFromPDF: (pdfBase64) =>
      callAgent("quiz", "/generate-quiz", "POST", { pdfBase64 }),
  },
};
