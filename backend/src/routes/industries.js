import express from "express";
import Industry from "../models/industry.js";

const router = express.Router();

// GET all industries
router.get("/", async (req, res, next) => {
  try {
    const industries = await Industry.find();
    res.json(industries);
  } catch (err) {
    next(err);
  }
});

// POST an industry (for admin/testing)
router.post("/", async (req, res, next) => {
  try {
    const industry = new Industry(req.body);
    await industry.save();
    res.json(industry);
  } catch (err) {
    next(err);
  }
});

export default router;