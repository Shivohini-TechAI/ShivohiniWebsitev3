import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, default: "Remote" },
  type: { type: String, default: "Full-time" }, // e.g., Full-time, Internship
  description: { type: String, default: "" },
  applyLink: { type: String, default: "" },
  postedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Job", jobSchema);