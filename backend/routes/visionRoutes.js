import { Router } from "express";
import fetch from "node-fetch";

const router = Router();

router.post("/analyze", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Forward to Vision Agent A2A endpoint
    const response = await fetch("http://localhost:6002/a2a", {
      method: "POST",
      body: JSON.stringify({
        message: {
          messageId: "msg-" + Date.now(),
          role: "user",
          kind: "message",
          parts: [{ kind: "text", text: `Analyze this image: ${imageUrl}` }],
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Vision fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
