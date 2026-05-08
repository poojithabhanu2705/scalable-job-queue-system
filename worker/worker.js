import { Worker } from "bullmq";
import IORedis from "ioredis";
import Job from "../models/Job.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

console.log("Worker started");
await new Promise((res) => setTimeout(res, 1000));

const workerId = Math.floor(Math.random() * 1000);

const worker = new Worker(
  "jobQueue",

  async (job) => {

    console.log("Job received:", job.name);
    
    await new Promise((res) => setTimeout(res, 2000));

    try {

      await Job.findOneAndUpdate(
        { jobId: job.id },
        { status: "active" }
      );

      console.log("Processing job:", job.name);

      if (job.name === "payment") {
        throw new Error("Payment failed");
      }

      await Job.findOneAndUpdate(
        { jobId: job.id },
        { status: "completed" }
      );

      console.log("Completed job:", job.name);

    } catch (error) {

      console.log("Inside catch block");

      await Job.findOneAndUpdate(
        { jobId: job.id },
        { status: "failed" }
      );

      console.log(error.message);

      throw error;
    }

  },

  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});

