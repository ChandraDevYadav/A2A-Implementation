// backend/src/controllers/quizController.js
import fetch from "node-fetch";
import FormData from "form-data";

export const generateQuiz = async (req, res) => {
  try {
    const { text, pdfBase64 } = req.body;

    if (!text && !pdfBase64) {
      return res.status(400).json({ error: "Please provide text or PDF" });
    }

    const formData = new FormData();

    if (text) formData.append("notes", text);

    if (pdfBase64) {
      const buffer = Buffer.from(pdfBase64, "base64");
      formData.append("file", buffer, { filename: "notes.pdf" });
    }

    const response = await fetch(
      "https://quizcreator.testir.xyz/generate-quiz",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Quiz API error: ${errText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Quiz fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
