import Campaign from "../models/Campaign.js";
import Job from "../models/Job.js";
import { jobQueue } from "../queue/queue.js";

export const campaignService = {
  createCampaign: async (data) => {
    const { name, subject, content, recipients, priority, retryAttempts } = data;
    
    // 1. Create Campaign in DB
    const campaign = await Campaign.create({
      name,
      subject,
      content,
      totalRecipients: recipients.length,
      status: "processing"
    });

    // 2. Add individual email jobs to BullMQ
    const jobs = recipients.map((email) => ({
      name: "email-delivery",
      data: {
        campaignId: campaign._id,
        recipientEmail: email,
        subject,
        content
      },
      opts: {
        priority: parseInt(priority),
        attempts: parseInt(retryAttempts),
        backoff: {
          type: "exponential",
          delay: 5000 // 5 seconds initial backoff
        },
        removeOnComplete: false, // Keep for logs
        removeOnFail: false
      }
    }));

    // Add jobs to queue
    const bullJobs = await jobQueue.addBulk(jobs);

    // 3. Create Job metadata in MongoDB for tracking
    const jobDocs = bullJobs.map((job, index) => ({
      jobId: job.id,
      campaignId: campaign._id,
      recipientEmail: recipients[index],
      type: "email-delivery",
      status: "waiting",
      priority: parseInt(priority),
      retryCount: 0
    }));

    await Job.insertMany(jobDocs);

    return campaign;
  },

  getStats: async () => {
    const stats = {
      sent: await Job.countDocuments({ status: "delivered" }),
      failed: await Job.countDocuments({ status: "failed" }),
      pending: await Job.countDocuments({ status: { $in: ["waiting", "active", "retrying"] } }),
      retryQueue: await Job.countDocuments({ status: "retrying" }),
      total: await Job.countDocuments()
    };
    
    return stats;
  }
};
