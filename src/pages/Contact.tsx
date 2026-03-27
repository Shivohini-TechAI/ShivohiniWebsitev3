import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";
import useScrollReveal from '../hooks/useScrollReveal';
import { websiteApiUrl } from "../config/api";

const Contact: React.FC = () => {
  useScrollReveal();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(websiteApiUrl("/api/contact"), {
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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050f20] px-4 py-24 text-white sm:px-6 sm:py-32">
      {/* Background aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00C8FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7B61FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <div data-reveal className="reveal-hidden mb-12 text-center sm:mb-16">
          <h2 className="text-3xl font-bold tracking-[-0.02em] font-display sm:text-4xl lg:text-[3.2rem]">
            Get in <span className="text-brand-gradient">Touch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 font-sans sm:text-lg">
            Have questions, project ideas, or collaboration opportunities?
            We’d love to hear from you.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
          {/* Contact Info Section */}
          <div data-reveal className="reveal-hidden flex flex-col justify-center space-y-10 sm:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="group flex items-start gap-4 sm:items-center sm:gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00C8FF]/40 transition-all duration-300">
                  <Mail className="w-6 h-6 text-[#00C8FF]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm font-bold tracking-wider uppercase mb-1">Email Us</p>
                  <p className="break-all text-white text-base font-medium sm:text-lg">bhatiagunjan27@gmail.com</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 sm:items-center sm:gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00C8FF]/40 transition-all duration-300">
                  <Phone className="w-6 h-6 text-[#00C8FF]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm font-bold tracking-wider uppercase mb-1">Call Us</p>
                  <p className="text-white text-lg font-medium">+91-7688929473</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 sm:items-center sm:gap-6">
                <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#00C8FF]/40 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-[#00C8FF]" />
                </div>
                <div>
                  <p className="text-white/40 text-sm font-bold tracking-wider uppercase mb-1">Visit Us</p>
                  <p className="text-white text-lg font-medium">Udaipur, Rajasthan, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <form data-reveal onSubmit={handleSubmit} className="reveal-hidden flex flex-col gap-6 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.3)] sm:p-8 md:p-10">
            <div className="grid grid-cols-1 gap-6">
              {["name", "email", "subject"].map((field) => (
                <div key={field} className="relative">
                  <label className="block text-[0.75rem] font-bold tracking-widest uppercase text-white/40 mb-2 ml-1">{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={(form as any)[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#00C8FF]/50 focus:bg-white/[0.06] transition-all font-sans"
                    placeholder={`Enter your ${field}`}
                  />
                </div>
              ))}
            </div>

            <div className="relative">
              <label className="block text-[0.75rem] font-bold tracking-widest uppercase text-white/40 mb-2 ml-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#00C8FF]/50 focus:bg-white/[0.06] transition-all resize-none font-sans"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#00C8FF] px-6 py-4 text-base font-bold text-[#050f20] 
                shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:bg-[#00b0e6] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
