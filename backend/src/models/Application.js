import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
  resumeLink: String, // Google Drive link instead of file
  appliedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", applicationSchema);
