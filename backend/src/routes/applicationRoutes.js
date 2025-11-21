import express from "express";
import nodemailer from "nodemailer";
import Application from "../models/Application.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// POST /api/apply — Submit Job Application
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message, resumeLink } = req.body;

    if (!name || !email || !phone || !resumeLink) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Save application in MongoDB
    const application = new Application({
      name,
      email,
      phone,
      message,
      resumeLink,
    });

    await application.save();

    // Send email to HR
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HR_EMAIL,
        pass: process.env.HR_PASS,
      },
    });

    const mailOptions = {
      from: process.env.HR_EMAIL,
      to: process.env.HR_EMAIL,
      subject: `New Job Application — ${name}`,
      text: `
New Candidate Applied:

Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${message}

Resume Link:
${resumeLink}
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Application stored + Email sent to HR");
    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.log("❌ Error submitting application:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
