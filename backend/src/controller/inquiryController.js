import Inquiry from "../models/Inquiry.js";
import nodemailer from "nodemailer";

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const inquiry = new Inquiry({ name, email, phone, message });
    await inquiry.save();

    // Send mail
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
      subject: `New Inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Inquiry submitted successfully" });
  } catch (error) {
    console.error("❌ Inquiry submission error:", error.message);
    res.status(500).json({ error: "Failed to submit. Please try again later." });
  }
};
