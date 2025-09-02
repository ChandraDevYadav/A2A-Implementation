import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { A2AClient } from "@a2a-js/sdk/client";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// HTTP + WebSocket server
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Helper: broadcast logs to all WebSocket clients
function broadcastLog(log) {
  const data = JSON.stringify(log);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}

// In-memory quiz results
const quizResults = [];

// REST API: store quiz result from frontend
app.post("/api/results", async (req, res) => {
  const result = req.body;
  quizResults.unshift(result); // store latest first
  console.log("📥 Quiz Result received:", result);

  // Broadcast to frontend
  broadcastLog({
    agent: "Quiz-Agent",
    status: "received result",
    payload: result,
    timestamp: new Date().toISOString(),
  });

  // Forward to Quiz-Agent via A2A
  try {
    const client = await A2AClient.fromCardUrl(
      "http://localhost:6002/.well-known/agent-card.json"
    );
    const message = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: JSON.stringify(result) }],
    };
    await client.sendMessage({ message });

    broadcastLog({
      agent: "Quiz-Agent",
      status: "forwarded",
      payload: result,
      timestamp: new Date().toISOString(),
    });

    console.log("➡️ Forwarded result to Quiz-Agent via A2A");
  } catch (err) {
    console.error("❌ Failed to forward to Quiz-Agent:", err.message);

    broadcastLog({
      agent: "Quiz-Agent",
      status: "error",
      payload: err.message,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({ status: "received" });
});

// REST API: get all stored quiz results
app.get("/api/results", (req, res) => {
  res.json(quizResults);
});

// REST API: forward frontend question to Speaker-Agent
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  console.log("➡️ Forwarding question to Speaker-Agent:", question);

  broadcastLog({
    agent: "Speaker-Agent",
    status: "question received",
    payload: question,
    timestamp: new Date().toISOString(),
  });

  try {
    const client = await A2AClient.fromCardUrl(
      "http://localhost:6001/.well-known/agent-card.json"
    );
    const message = {
      messageId: uuidv4(),
      role: "user",
      kind: "message",
      parts: [{ kind: "text", text: question }],
    };
    const response = await client.sendMessage({ message });

    console.log("⬅️ Response from Speaker-Agent:", response.result || response);

    broadcastLog({
      agent: "Speaker-Agent",
      status: "responded",
      payload: response.result || response,
      timestamp: new Date().toISOString(),
    });

    res.json(response.result || response);
  } catch (err) {
    console.error("❌ Error sending to Speaker-Agent:", err.message);

    broadcastLog({
      agent: "Speaker-Agent",
      status: "error",
      payload: err.message,
      timestamp: new Date().toISOString(),
    });

    res.status(500).json({ error: err.message });
  }
});

// WebSocket connection events
wss.on("connection", (ws) => {
  console.log("🔗 Frontend connected to WebSocket");

  ws.send(
    JSON.stringify({
      agent: "Gateway",
      status: "connected",
      timestamp: new Date().toISOString(),
    })
  );

  ws.on("close", () => {
    console.log("❌ Frontend disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🌐 Gateway REST API + WS running at http://localhost:${PORT}`);
});
