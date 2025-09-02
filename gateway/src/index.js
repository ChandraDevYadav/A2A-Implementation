import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import axios from "axios";
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
  quizResults.unshift(result);
  console.log("📥 Quiz Result received:", result);

  broadcastLog({
    agent: "Quiz-Agent",
    status: "received result",
    payload: result,
    timestamp: new Date().toISOString(),
  });

  // Forward to Quiz-Agent via HTTP POST
  try {
    const response = await axios.post("http://localhost:6002/a2a", {
      jsonrpc: "2.0",
      id: uuidv4(),
      method: "handleRequest",
      params: { topic: JSON.stringify(result) },
    });

    broadcastLog({
      agent: "Quiz-Agent",
      status: "forwarded",
      payload: response.data,
      timestamp: new Date().toISOString(),
    });

    console.log("➡️ Forwarded result to Quiz-Agent via HTTP POST");
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
    const response = await axios.post("http://localhost:6003/a2a", {
      jsonrpc: "2.0",
      id: uuidv4(),
      method: "handleRequest",
      params: { topic: question },
    });

    console.log("⬅️ Response from Speaker-Agent:", response.data);

    broadcastLog({
      agent: "Speaker-Agent",
      status: "responded",
      payload: response.data,
      timestamp: new Date().toISOString(),
    });

    res.json(response.data);
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

// REST API: forward question to Niche-Agent
app.post("/api/niche", async (req, res) => {
  const { question } = req.body;
  console.log("➡️ Forwarding question to Niche-Agent:", question);

  broadcastLog({
    agent: "Niche-Agent",
    status: "question received",
    payload: question,
    timestamp: new Date().toISOString(),
  });

  try {
    const response = await axios.post("http://localhost:6000/a2a", {
      jsonrpc: "2.0",
      id: uuidv4(),
      method: "handleRequest",
      params: { topic: question },
    });

    console.log("⬅️ Response from Niche-Agent:", response.data);

    broadcastLog({
      agent: "Niche-Agent",
      status: "responded",
      payload: response.data,
      timestamp: new Date().toISOString(),
    });

    res.json(response.data);
  } catch (err) {
    console.error("❌ Error sending to Niche-Agent:", err.message);

    broadcastLog({
      agent: "Niche-Agent",
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
