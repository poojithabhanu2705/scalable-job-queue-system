import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: String,
  type: String,
  status: {
    type: String,
    enum: ["waiting", "active", "completed", "failed"],
    default: "waiting"
  },
  priority: Number,
  attempts: Number,
  delay: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model("Job", jobSchema);

export default Job;