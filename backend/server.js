import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import agentRoutes from "./routes/agentRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

// Initialize app
const app = express();

// Middleware
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(logger);

// Routes
app.get("/", (req, res) => res.send("A2A Gateway API"));
app.use("/api/agents", agentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
