import express from "express";
import cors from "cors";
import jobRoutes from "./routes/jobRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/jobs", jobRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});