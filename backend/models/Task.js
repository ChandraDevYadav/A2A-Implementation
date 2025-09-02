import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    niche: String,
    vision: String,
    identity: String,
    quiz: Array,
    status: {
      type: String,
      enum: ["pending", "in_progress", "done", "error"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
