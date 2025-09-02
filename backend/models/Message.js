import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    type: { type: String },
    from: { type: String },
    to: { type: String },
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
