import Application from "../models/Application.js";
import nodemailer from "nodemailer";

export const submitApplication = async (req, res) => {
  try {
    // ✅ Step 1: Confirm backend is receiving the request
    console.log("📩 Incoming application data:", req.body);
    console.log("📎 Uploaded file:", req.file);

    const { name, email, phone, jobTitle } = req.body;
    const resume = req.file ? req.file.path : null;

    // ✅ Step 2: Save to MongoDB
    const application = new Application({
      name,
      email,
      phone,
      resume,
      jobTitle,
    });

    await application.save();
    console.log("✅ Application saved to MongoDB:", application);

    // ✅ Step 3: Send Email to HR
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.HR_EMAIL,
        pass: process.env.HR_PASS,
      },
    });

    const mailOptions = {
      from: process.env.HR_EMAIL,
      to: process.env.HR_EMAIL, // HR receives the mail
      subject: `New Job Application: ${jobTitle}`,
      text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Job: ${jobTitle}
      `,
      attachments: resume
        ? [{ filename: "resume.pdf", path: resume }]
        : [],
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to HR successfully");

    // ✅ Success response to frontend
    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("❌ Application submission failed:", error);
    res.status(500).json({ error: error.message || "Failed to submit application" });
  }
};
