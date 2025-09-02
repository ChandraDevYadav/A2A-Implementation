import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  DefaultRequestHandler,
  JsonRpcTransportHandler,
  InMemoryTaskStore,
  DefaultExecutionEventBus,
  DefaultExecutionEventBusManager,
  ResultManager,
  RequestContext,
} from "@a2a-js/sdk/server";

const app = express();
const PORT = 6000;
const agentId = "niche-agent";

app.use(cors());
app.use(bodyParser.json());

// === Core A2A Agent Setup ===
const taskStore = new InMemoryTaskStore();
const eventBus = new DefaultExecutionEventBus();
const eventBusManager = new DefaultExecutionEventBusManager(eventBus);
const resultManager = new ResultManager(taskStore, eventBusManager);

// === Niche Agent Logic ===
async function nicheAgentLogic(input) {
  console.log(`👉 ${agentId} received input:`, input);

  const text = input.topic || input.text || "";
  let recommendation = "";

  if (text.toLowerCase().includes("linux")) {
    recommendation = "Linux Foundation Certified System Administrator Course";
  } else if (text.toLowerCase().includes("cloud")) {
    recommendation = "Cloud Native Kubernetes Fundamentals";
  } else {
    recommendation = "General Entrepreneurship & Startup Course";
  }

  return { recommendation, originalInput: text };
}

// === Request Handler ===
const requestHandler = new DefaultRequestHandler(async (request) => {
  const ctx = new RequestContext(request);
  const result = await nicheAgentLogic(request.params);
  return resultManager.createSuccessResult(ctx, result);
});

// === JSON-RPC Transport Handler ===
const transportHandler = new JsonRpcTransportHandler(requestHandler);

// === API Endpoint ===
app.post("/a2a", async (req, res) => {
  try {
    const result = await transportHandler.handle(req.body);
    res.json(result);
  } catch (err) {
    console.error("❌ Error handling request:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🤖 ${agentId} running at http://localhost:${PORT}/a2a`);
});
