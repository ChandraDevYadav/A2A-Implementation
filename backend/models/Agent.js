import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    endpoint: { type: String, required: true }, // e.g. http://localhost:4001
    description: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "online" },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", AgentSchema);
