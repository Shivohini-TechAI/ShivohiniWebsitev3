// src/routes/jobs.js
import express from "express";
import { body, validationResult } from "express-validator";
import { supabase } from "../supabaseClient.js"; // <- make sure this file exists and calls dotenv.config()

const router = express.Router();

// Optional: simple admin header check middleware (commented out by default).
// To enable, uncomment and add `router.post("/", adminCheck, [...], handler)`
// and set ADMIN_KEY in your backend .env.
// function adminCheck(req, res, next) {
//   if (req.headers["x-admin-key"] !== process.env.ADMIN_KEY) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }
//   next();
// }

// GET /api/jobs  - public
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("posted_at", { ascending: false });

    if (error) {
      console.error("Supabase GET /jobs error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(data);
  } catch (err) {
    console.error("GET /api/jobs error:", err);
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
    body("applyLink")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("applyLink must be a valid URL"),
  ],
  // If using admin middleware: replace next line with: adminCheck,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { title, location, type, description, applyLink } = req.body;

      const payload = {
        title,
        location: location || null,
        type: type || null,
        description: description || null,
        apply_link: applyLink || null,
      };

      const { data, error } = await supabase
        .from("jobs")
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error (/api/jobs):", error);
        return res.status(500).json({ error: "Database error" });
      }

      return res.status(201).json(data);
    } catch (err) {
      console.error("POST /api/jobs error:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

export default router;
