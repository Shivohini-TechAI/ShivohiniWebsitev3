import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";

import jobsRouter from "./routes/jobs.js";
import productsRouter from "./routes/products.js";
import industriesRouter from "./routes/industries.js";
import errorHandler from "./middleware/errorHandler.js";
import applicationRouter from "./routes/applicationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-domain.com"]
}));
app.use(express.json());

// ================================
// ✅ Serve Uploads Folder (Images + Resumes)
// ================================
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

console.log("📂 Serving uploads from:", path.join(__dirname, "uploads"));

// Routes
app.use("/api/jobs", jobsRouter);
app.use("/api/products", productsRouter);
app.use("/api/industries", industriesRouter);
app.use("/api/apply", applicationRouter);
app.use("/api/contact", contactRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Error handler
app.use(errorHandler);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));