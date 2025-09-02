// src/pages/Agents.jsx
import { useState } from "react";
import AgentCard from "../components/AgentCard";
import { api } from "../api";

export default function Agents() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleRun = async (agentFunc) => {
    try {
      const result = await agentFunc();
      console.log("✅ Result:", result);
      alert(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error("❌ Agent error:", err);
      alert("Agent failed: " + err.message);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    setPdfFile(file);
  };

  const handleQuizRun = () => {
    if (pdfFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result.split(",")[1]; // remove data prefix
        handleRun(() => api.quiz.generateQuizFromPDF(base64));
      };
      reader.readAsDataURL(pdfFile);
    } else {
      handleRun(() =>
        api.quiz.generateQuizFromText("These are my summarized AI notes...")
      );
    }
  };

  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <AgentCard
        title="Niche Agent"
        description="Generate niche ideas"
        onRun={() => handleRun(() => api.niche.generateIdeas("Tech"))}
      />
      <AgentCard
        title="Vision Agent"
        description="Analyze vision"
        onRun={() =>
          handleRun(() => api.vision.analyzeImage("https://example.com"))
        }
      />
      <AgentCard
        title="Speaker Agent"
        description="Generate speech"
        onRun={() => handleRun(() => api.speaker.generateSpeech("AI"))}
      />
      <AgentCard
        title="Quiz Agent"
        description="Generate quiz from notes or PDF"
        onRun={handleQuizRun}
      />
      <div className="col-span-2 mt-2">
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfChange}
        />
        <p className="text-sm text-gray-500">
          Optional: upload a PDF to generate quiz
        </p>
      </div>
    </div>
  );
}
