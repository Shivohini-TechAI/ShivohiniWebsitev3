import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // ✅ Save message to MongoDB
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    // ✅ Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.HR_EMAIL,
      subject: `📬 New Contact Message: ${subject}`,
      html: `
        <h3>New Message from Website Contact Form</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Contact saved and email sent:", name);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    res.status(500).json({ success: false, error: "Error sending message" });
  }
};
