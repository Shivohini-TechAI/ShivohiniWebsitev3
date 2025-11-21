import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert(`❌ Error: ${data.error || "Failed to send message"}`);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("⚠️ Unable to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0A1A3F] via-[#07112C] to-[#010511] text-white py-24 flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 md:p-14">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Get in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Touch
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info Section */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-gray-300 text-lg leading-relaxed">
              Have questions, project ideas, or collaboration opportunities?
              We’d love to hear from you. Our experts will get back to you soon!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-300">info@shivohinitechai.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-300">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {["name", "email", "subject"].map((field, idx) => (
              <div key={idx} className="relative">
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={(form as any)[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                  placeholder={`Enter your ${field}`}
                />
              </div>
            ))}

            <div className="relative">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all resize-none"
                placeholder="Enter your message"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-[0_0_25px_rgba(0,224,255,0.3)]
                transition-all duration-300 ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:scale-105 hover:shadow-[0_0_35px_rgba(0,224,255,0.5)]"
                }`}
            >
              {loading ? "Sending..." : "Send Message"}
              {!loading && <Send className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;