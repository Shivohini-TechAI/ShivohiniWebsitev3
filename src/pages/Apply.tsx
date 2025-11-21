import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Apply: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !email || !experience || !resumeLink) {
      alert("Please fill all fields before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: experience,
          resumeLink,
        }),
      });

      if (response.ok) {
        alert("🎉 Application submitted successfully!");
        navigate("/");
      } else {
        alert("❌ Failed to submit. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#0A1A3F] to-[#1E2A78] text-white px-6 py-16">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-8">
          Apply Now
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-200 font-medium">

          <div>
            <label className="block mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30"
            />
          </div>

          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30"
            />
          </div>

          <div>
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30"
            />
          </div>

          <div>
            <label className="block mb-2">Experience</label>
            <textarea
              rows={3}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2">Resume Link (Google Drive)</label>
            <input
              type="url"
              placeholder="Paste your Google Drive resume link"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl"
          >
            Submit Application
          </button>
        </form>
      </div>
    </section>
  );
};

export default Apply;
