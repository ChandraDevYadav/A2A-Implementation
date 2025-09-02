import AgentCard from "../components/AgentCard";
import { api } from "../api";

export default function Agents() {
  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      <AgentCard
        title="Niche Agent"
        description="Generate niche ideas"
        onRun={() => api.niche.generateIdeas("Tech")}
      />
      <AgentCard
        title="Vision Agent"
        description="Analyze vision"
        onRun={() => api.vision.analyzeImage("https://example.com")}
      />
      <AgentCard
        title="Speaker Agent"
        description="Generate speech"
        onRun={() => api.speaker.generateSpeech("AI")}
      />
      <AgentCard
        title="Quiz Agent"
        description="Generate quiz"
        onRun={() => api.quiz.generateQuiz("AI")}
      />
    </div>
  );
}
