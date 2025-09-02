import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import quizRoutes from "./routes/quizRoutes.js";
import nicheRoutes from "./routes/nicheRoutes.js";
import visionRoutes from "./routes/visionRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173" })); // allow frontend
app.use(bodyParser.json());

// Agent routes
app.use("/api/niche", nicheRoutes);
app.use("/api/vision", visionRoutes);
app.use("/api/speaker", speakerRoutes);
app.use("/api/quiz", quizRoutes);

app.get("/", (req, res) => res.send("A2A Gateway API running"));

app.listen(PORT, () => {
  console.log(`🌐 Gateway API running at http://localhost:${PORT}`);
});
