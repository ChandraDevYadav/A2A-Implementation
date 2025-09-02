import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { A2AClient } from "@a2a-js/sdk/client";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 6000;
const agentId = "niche-agent";

app.use(cors());
app.use(bodyParser.json());

// Endpoint for gateway to send messages
app.post("/a2a", async (req, res) => {
  const { message } = req.body;
  console.log(
    `📩 ${agentId} received message:`,
    message.parts.map((p) => p.text).join(" ")
  );

  // Example: simple response logic
  const responseText = `Niche-Agent processed: "${message.parts
    .map((p) => p.text)
    .join(" ")}"`;

  // Send back to gateway
  try {
    const client = await A2AClient.fromCardUrl(
      "http://localhost:4000/.well-known/agent-card.json"
    );
    const responseMessage = {
      messageId: uuidv4(),
      role: "agent",
      kind: "message",
      parts: [{ kind: "text", text: responseText }],
    };
    await client.sendMessage({ message: responseMessage });
    console.log(`⬅️ ${agentId} sent response back to Gateway`);
  } catch (err) {
    console.error("❌ Error sending back to Gateway:", err.message);
  }

  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`🤖 ${agentId} running at http://localhost:${PORT}`);
});
