import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Briefcase, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useScrollReveal from "../hooks/useScrollReveal";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const getItemsPerSlide = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1280) return 2;
  return 3;
};

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);
  useScrollReveal([currentSlide, jobs]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        const jobsData = Array.isArray(data) ? data : [];
        setJobs(jobsData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError("Unable to load current openings at this time. Please check back later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(jobs.length / itemsPerSlide));

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, Math.max(totalSlides - 1, 0)));
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const currentJobs = jobs.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050f20] py-24 text-white sm:py-32">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-[#00C8FF]/5 blur-[140px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#7B61FF]/3 blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-16">
        <div data-reveal className="reveal-hidden mb-14 max-w-2xl sm:mb-20 lg:mb-24">
          <h2 className="mb-6 text-3xl font-display font-bold leading-tight text-white sm:mb-8 sm:text-4xl lg:text-[3.5rem]">
            Build the <span className="text-brand-gradient">Next Intelligence</span> With Us
          </h2>
          <p className="text-base leading-relaxed text-white/50 font-sans sm:text-lg md:text-xl">
            We are architecting the future of cognitive technology. Join our elite team of visionaries and neural engineers.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#00C8FF]" />
            <p className="text-[0.7rem] font-bold uppercase tracking-widest text-white/20">Decrypting Opportunities...</p>
          </div>
        ) : error ? (
          <div className="mx-auto flex max-w-2xl min-h-[300px] flex-col items-center justify-center rounded-[2.5rem] border border-red-500/10 bg-red-500/5 p-8 text-center sm:p-12">
            <p className="text-red-400 font-sans">{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="mx-auto flex max-w-2xl min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-white/[0.05] bg-white/[0.02] p-10 text-center shadow-2xl backdrop-blur-md sm:p-16">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/5 bg-white/[0.03]">
              <Briefcase className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="mb-4 text-2xl font-display font-bold">No Active Missions</h3>
            <p className="max-w-sm text-white/40 font-sans">
              While we aren't currently deploying new roles, we're always monitoring high-level talent.
            </p>
          </div>
        ) : (
          <div className="relative">
            {totalSlides > 1 && (
              <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-white/35 sm:text-sm">
                  {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] sm:h-12 sm:w-12 md:absolute md:left-0 md:top-1/2 md:-translate-x-4 md:-translate-y-1/2 lg:-translate-x-14"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] sm:h-12 sm:w-12 md:absolute md:right-0 md:top-1/2 md:translate-x-4 md:-translate-y-1/2 lg:translate-x-14"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            )}

            <div className={`grid items-stretch gap-5 sm:gap-6 lg:gap-8 ${itemsPerSlide === 1 ? "grid-cols-1" : itemsPerSlide === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
              {currentJobs.map((job, i) => (
                <div
                  key={job._id}
                  data-reveal
                  className="reveal-hidden group flex flex-col rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-[#00C8FF]/30 shadow-2xl sm:p-8 lg:rounded-[2.5rem] lg:p-10"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-white/60">
                      {job.department}
                    </div>
                    <div className="text-[0.65rem] font-bold uppercase tracking-widest text-[#00C8FF] opacity-60">
                      {job.type}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="mb-4 text-xl font-display font-bold tracking-tight text-white transition-all duration-300 group-hover:text-brand-gradient sm:text-2xl">
                      {job.title}
                    </h3>

                    <div className="mb-8 flex items-center text-[0.8rem] font-bold tracking-wide text-white/30 font-sans">
                      <MapPin className="mr-2 h-3.5 w-3.5 text-[#00C8FF]/50" />
                      {job.location}
                    </div>

                    <p className="mb-10 line-clamp-4 text-[0.9rem] leading-relaxed text-white/40 font-sans">
                      {job.description}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/apply/${job._id}`)}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-4 font-bold text-white shadow-xl transition-all duration-500 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20]"
                  >
                    View Role
                  </button>
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <div className="mt-12 flex justify-center gap-3 sm:mt-16">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`rounded-full transition-all duration-500 ${
                      currentSlide === index ? "h-2 w-12 bg-[#00C8FF] shadow-2xl" : "h-2 w-2 bg-white/10 hover:bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Careers;
