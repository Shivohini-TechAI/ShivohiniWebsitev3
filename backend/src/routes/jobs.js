import express from "express";
import { body, validationResult } from "express-validator";
import Job from "../models/job.js";

const router = express.Router();

// GET /api/jobs  - public
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /api/jobs - add job (admin)
// Minimal validation; lock behind auth in production
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("location").optional().isString(),
    body("type").optional().isString(),
    body("description").optional().isString(),
    body("applyLink").optional().isURL().withMessage("applyLink must be a URL")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const newJob = new Job(req.body);
      await newJob.save();
      res.status(201).json(newJob);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
