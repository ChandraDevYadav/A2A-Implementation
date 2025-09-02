import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    cardUrl: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["online", "offline"], default: "online" },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", AgentSchema);
