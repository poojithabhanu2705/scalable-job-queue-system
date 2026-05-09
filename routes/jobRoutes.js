import express from "express";
import { jobQueue } from "../queue/queue.js";
import Job from "../models/Job.js";
import Campaign from "../models/Campaign.js";
import { campaignService } from "../services/campaignService.js";

const router = express.Router();

// 1. Create a new campaign
router.post("/add-campaign", async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.json(campaign);
  } catch (error) {
    console.error("Campaign creation error:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
});

// 2. Get delivery stats
router.get("/stats", async (req, res) => {
  try {
    const stats = await campaignService.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// 3. Get all delivery logs (paginated or limit for demo)
router.get("/all", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(100);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// 4. Retry a failed job
router.post("/retry/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobQueue.getJob(id);
    if (job) {
      await job.retry();
      await Job.findOneAndUpdate({ jobId: id }, { status: "retrying" });
      res.json({ message: "Job scheduled for retry" });
    } else {
      res.status(404).json({ error: "Job not found in queue" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retry job" });
  }
});

// 5. Delete a job/log entry
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobQueue.getJob(id);
    if (job) {
      await job.remove();
    }
    await Job.findOneAndDelete({ jobId: id });
    res.json({ message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;