import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/speak", async (req, res) => {
  try {
    const { text } = req.body;

    // Forward to Speaker Agent A2A endpoint
    const response = await fetch("http://localhost:6004/a2a", {
      method: "POST",
      body: JSON.stringify({
        message: {
          messageId: "msg-" + Date.now(),
          role: "user",
          kind: "message",
          parts: [{ kind: "text", text: `Generate speech for: ${text}` }],
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Speaker fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
