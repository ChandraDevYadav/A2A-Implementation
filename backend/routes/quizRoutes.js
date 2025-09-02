import { Router } from "express";
import fetch from "node-fetch";
import FormData from "form-data";

const router = Router();

router.post("/generate-quiz", async (req, res) => {
  try {
    const { text, pdfBase64 } = req.body;

    const formData = new FormData();
    if (text) formData.append("notes", text);

    if (pdfBase64) {
      const buffer = Buffer.from(pdfBase64, "base64");
      formData.append("file", buffer, { filename: "notes.pdf" });
    }

    // Forward to Quiz Agent A2A endpoint
    const response = await fetch("http://localhost:6003/a2a", {
      method: "POST",
      body: JSON.stringify({
        message: {
          messageId: "msg-" + Date.now(),
          role: "user",
          kind: "message",
          parts: [{ kind: "text", text: text || "PDF uploaded" }],
        },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Quiz fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
