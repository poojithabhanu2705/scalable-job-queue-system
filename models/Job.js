import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobId: String,
  type: String,
  status: String,
});

const Job = mongoose.model("Job", jobSchema);

export default Job;