const BASE_URLS = {
  niche: "http://localhost:4001",
  vision: "http://localhost:4002",
  speaker: "http://localhost:4003",
  quiz: "http://localhost:4004",
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
    generateQuiz: (topic) =>
      callAgent("quiz", "/generate-quiz", "POST", { topic }),
  },
};
