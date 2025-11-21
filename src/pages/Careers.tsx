import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const itemsPerSlide = 3; // Number of cards per view
  const totalSlides = Math.ceil(jobs.length / itemsPerSlide);

  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setLoading(false);
      });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentJobs = () => {
    const start = currentSlide * itemsPerSlide;
    return jobs.slice(start, start + itemsPerSlide);
  };

  const handleApplyClick = (jobId: string) => {
    navigate(`/apply/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white text-lg">
        Loading jobs...
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-[#020617] via-[#0A1A3F] to-[#1E2A78] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Current <span className="text-cyan-400">Openings</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed">
            Explore our latest opportunities and join a team driving innovation with cutting-edge AI solutions.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Job Cards */}
          <div
            ref={carouselRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12"
          >
            {getCurrentJobs().map((job) => {
              const isHovered = hoveredJob === job._id;

              return (
                <div
                  key={job._id}
                  className={`group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 cursor-pointer ${
                    isHovered ? "ring-2 ring-cyan-400" : ""
                  }`}
                  onMouseEnter={() => setHoveredJob(job._id)}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  {/* Job Content */}
                  <h3 className="text-xl font-bold text-cyan-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {job.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-1">
                    {job.department} • {job.location}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">{job.type}</p>
                  <p className="text-gray-300 text-sm mb-4 group-hover:text-gray-200 transition-colors duration-300">
                    {job.description}
                  </p>

                  <button
                    onClick={() => handleApplyClick(job._id)}
                    className="relative z-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
                  >
                    Apply Now
                  </button>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
                </div>
              );
            })}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-cyan-400 scale-125"
                    : "bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Careers;
