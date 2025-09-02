import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // TaskSend, TaskArtifactUpdate, etc.
    from: { type: String, required: true },
    to: { type: String, required: true },
    payload: { type: Object, default: {} },
    status: {
      type: String,
      enum: ["sent", "received", "error"],
      default: "sent",
    },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
