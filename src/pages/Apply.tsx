import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import useScrollReveal from '../hooks/useScrollReveal';
import { websiteApiUrl } from "../config/api";

const Apply: React.FC = () => {
  useScrollReveal();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [jobTitle, setJobTitle] = useState<string>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(false);

  useEffect(() => {
    if (id) {
      setFetchingJob(true);
      fetch(websiteApiUrl(`/api/jobs/${id}`))
        .then(res => res.json())
        .then(data => {
          if (data && data.title) {
            setJobTitle(data.title);
          }
        })
        .catch(err => console.error("Error fetching job details:", err))
        .finally(() => setFetchingJob(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !phone || !email || !experience || !resumeLink) {
      alert("Please fill all fields before submitting.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(websiteApiUrl("/api/apply"), {
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
          jobId: id,
          jobTitle: jobTitle
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050f20] px-4 py-24 text-white sm:px-6 sm:py-32">
      {/* Background aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00C8FF]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7B61FF]/3 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div data-reveal className="reveal-hidden relative z-10 w-full max-w-2xl">
        <button 
          onClick={() => navigate(-1)}
          className="group mb-8 flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-white/30 backdrop-blur-md transition-all hover:text-[#00C8FF] sm:mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[0.7rem] font-bold tracking-widest uppercase">Go Back</span>
        </button>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8 md:rounded-[2.5rem] md:p-14">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00C8FF]/10 to-transparent blur-2xl rounded-full translate-x-16 -translate-y-16" />
          
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="mb-4 text-3xl font-display font-bold tracking-tight sm:text-4xl md:text-5xl">
              Apply <span className="text-brand-gradient">Now</span>
            </h2>
            {fetchingJob ? (
              <div className="flex justify-center items-center gap-3 text-white/20">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[0.65rem] uppercase font-bold tracking-widest">Identifying Opportunity...</span>
              </div>
            ) : jobTitle && (
              <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-[#00C8FF]/10 border border-[#00C8FF]/20 text-[#00C8FF] text-sm font-bold tracking-wide">
                <Briefcase className="w-4 h-4" />
                <span>{jobTitle}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <div className="space-y-2">
                <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-white/40 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:bg-white/[0.06] focus:outline-none sm:px-6"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-white/40 ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:bg-white/[0.06] focus:outline-none sm:px-6"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-white/40 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:bg-white/[0.06] focus:outline-none sm:px-6"
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-white/40 ml-1">Brief Experience</label>
              <textarea
                rows={3}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:bg-white/[0.06] focus:outline-none sm:px-6"
                placeholder="Tell us about your background..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-[0.7rem] font-bold tracking-widest uppercase text-white/40 ml-1">Resume Link (G-Drive / Dropbox)</label>
              <input
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white transition-all font-sans focus:border-[#00C8FF]/50 focus:bg-white/[0.06] focus:outline-none sm:px-6"
                placeholder="Paste link to your resume"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#00C8FF] py-4 text-base font-bold text-[#050f20] 
                shadow-[0_20px_40px_rgba(0,200,255,0.2)] hover:shadow-[0_25px_50px_rgba(0,200,255,0.3)] hover:bg-[#00b0e6] transform hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Deploying Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Apply;
