import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: String,
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  recipientEmail: String,
  type: String,
  status: {
    type: String,
    enum: ["waiting", "active", "delivered", "failed", "retrying"],
    default: "waiting"
  },
  priority: Number,
  retryCount: { type: Number, default: 0 },
  failureReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date
});

const Job = mongoose.model("Job", jobSchema);

export default Job;