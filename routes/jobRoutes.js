import express from "express";
import { jobQueue } from "../queue/queue.js";
import Job from "../models/Job.js";

const router = express.Router();

router.post("/add-job", async (req, res) => {
  const { type, data, priority = 1, delay = 0, attempts = 3 } = req.body;

  const job = await jobQueue.add(type, data, {
    delay: parseInt(delay),
    attempts: parseInt(attempts),
    backoff: {
      type: "fixed",
      delay: 2000,
    },
    priority: parseInt(priority),
    removeOnComplete: true,
    removeOnFail: false,
  });

  await Job.create({
    jobId: job.id,
    type,
    status: "waiting",
    priority: parseInt(priority),
    attempts: parseInt(attempts),
    delay: parseInt(delay),
  });

  res.json({ jobId: job.id });
});

router.get("/all", async (req, res) => {

  const jobs = await Job.find();

  res.json(jobs);
});

router.get("/status/:status", async (req, res) => {

  const jobs = await Job.find({
    status: req.params.status,
  });

  res.json(jobs);
});

router.get("/:id", async (req, res) => {

  const job = await Job.findOne({
    jobId: req.params.id,
  });

  res.json(job);
});

export default router;