import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/generate", async (req, res) => {
  try {
    const { topic } = req.body;

    // Forward to Niche Agent A2A endpoint
    const response = await fetch("http://localhost:6001/a2a", {
      method: "POST",
      body: JSON.stringify({
        message: {
          messageId: "msg-" + Date.now(),
          role: "user",
          kind: "message",
          parts: [{ kind: "text", text: `Generate niche ideas for: ${topic}` }],
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Niche fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
