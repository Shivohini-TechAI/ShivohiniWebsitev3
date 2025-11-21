import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  icon: String,
  features: [String],
  color: String,
  bgColor: String
});

export default mongoose.model("Product", productSchema);