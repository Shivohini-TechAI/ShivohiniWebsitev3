// src/components/Industries.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, ChevronRight, 
  Building, Utensils, ShoppingCart, Ship, 
  Truck, GraduationCap, Home, CircleDollarSign, 
  Users, Trophy 
} from "lucide-react";
import useScrollReveal from '../hooks/useScrollReveal';

interface Industry {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  solutions: string[];
  route: string;
}

const industries: Industry[] = [
  {
    id: 1,
    title: "Hotel Industry",
    description: "AI-powered hotel management with smart check-in, personalized guest experiences, and automated operations.",
    icon: Building,
    solutions: ["AI Agent Integration", "Drone for Hotels", "Face Recognition", "AI Virtual Assistant"],
    route: "/industries/hotel",
  },
  {
    id: 2,
    title: "Restaurant Industry",
    description: "Intelligent restaurant solutions with menu optimization, order management, and customer experience enhancement.",
    icon: Utensils,
    solutions: ["AI Sales Lead Generator", "Content Creator AI", "Virtual Assistant", "AI Marketing Manager"],
    route: "/industries/restaurant",
  },
  {
    id: 3,
    title: "Supermarket",
    description: "Smart retail solutions with inventory management, customer behavior analysis, and automated checkout.",
    icon: ShoppingCart,
    solutions: ["Advanced Security", "AI Inventory Management", "Smart Checkout AI", "AI Marketing Videos"],
    route: "/industries/supermarket",
  },
  {
    id: 4,
    title: "Export-Import",
    description: "AI-driven trade management with documentation automation and supply chain optimization.",
    icon: Ship,
    solutions: ["AI Cost Estimator", "AI Virtual Assistant for Trade", "Route Optimization"],
    route: "/industries/export-import",
  },
  {
    id: 5,
    title: "Logistics",
    description: "Smart logistics with route optimization, warehouse automation, and delivery tracking.",
    icon: Truck,
    solutions: ["Fleet Management AI", "Warehouse Automation", "Delivery Tracking", "AI CRM Integration"],
    route: "/industries/logistics",
  },
  {
    id: 6,
    title: "Education",
    description: "EdTech solutions with personalized learning, assessment automation, and student analytics.",
    icon: GraduationCap,
    solutions: ["AI Personalized Learning", "Student Analytics", "Virtual Classrooms", "Assessment Automation"],
    route: "/industries/education",
  },
  {
    id: 7,
    title: "Real Estate",
    description: "Property management with market analysis, virtual tours, and intelligent client matching.",
    icon: Home,
    solutions: ["AI Calling Assistant", "Virtual Tours", "Client Matching AI", "AI Marketing Manager"],
    route: "/industries/realestate",
  },
  {
    id: 8,
    title: "Finance",
    description: "FinTech solutions with automated bookkeeping, fraud detection, and investment analysis.",
    icon: CircleDollarSign,
    solutions: ["AI Investment Analysis", "Automated Bookkeeping", "Fraud Detection AI", "Risk Management AI"],
    route: "/industries/finance",
  },
  {
    id: 9,
    title: "HR Industry",
    description: "HR management with AI-powered recruitment, employee analytics, and performance optimization.",
    icon: Users,
    solutions: ["AI Recruitment", "Employee Analytics", "Performance Optimization", "Training Automation"],
    route: "/industries/hr",
  },
  {
    id: 10,
    title: "Sports",
    description: "Sports analytics with performance tracking, fan engagement, and intelligent event management.",
    icon: Trophy,
    solutions: ["Performance Analytics AI", "Fan Engagement AI", "Event Management AI", "Talent Scouting AI"],
    route: "/industries/sports",
  },
];

const getItemsPerSlide = () => {
  if (typeof window === "undefined") return 4;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1280) return 2;
  return 4;
};

const Industries: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(getItemsPerSlide);
  useScrollReveal([currentSlide]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(industries.length / itemsPerSlide);

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, Math.max(totalSlides - 1, 0)));
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const currentIndustries = industries.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="relative overflow-hidden bg-[#050f20] py-20 sm:py-24 lg:py-32">
      {/* Aurora glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#00C8FF]/5 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[#7B61FF]/3 rounded-full blur-[140px] translate-x-1/2" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-16">
        <div data-reveal className="reveal-hidden mb-14 max-w-2xl sm:mb-20 lg:mb-24">
          <h2 className="mb-6 text-3xl font-display font-bold leading-tight text-white sm:mb-8 sm:text-4xl lg:text-[3.5rem]">
            Industries We <span className="text-brand-gradient">Serve</span>
          </h2>
          <p className="text-base leading-relaxed text-white/50 font-sans sm:text-lg md:text-xl">
            Architecting specialized intelligence for the global market, transforming traditional verticals into autonomous ecosystems.
          </p>
        </div>

        <div className="relative">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <div className="text-xs font-bold uppercase tracking-[0.24em] text-white/35 sm:text-sm">
              {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                aria-label="Previous industries"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] focus:outline-none sm:h-12 sm:w-12 md:absolute md:left-0 md:top-1/2 md:-translate-x-4 md:-translate-y-1/2 lg:-translate-x-14"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next industries"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] focus:outline-none sm:h-12 sm:w-12 md:absolute md:right-0 md:top-1/2 md:translate-x-4 md:-translate-y-1/2 lg:translate-x-14"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className={`grid items-stretch gap-5 ${itemsPerSlide === 1 ? "grid-cols-1" : itemsPerSlide === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-4"}`}>
            {currentIndustries.map((industry, i) => {
              const IconComp = industry.icon;
              return (
                <div
                  key={industry.id}
                  data-reveal
                  onClick={() => navigate(industry.route)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate(industry.route)}
                  className="reveal-hidden group flex flex-col rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl
                    hover:border-[#00C8FF]/30 transition-all duration-500
                    hover:-translate-y-3 shadow-2xl cursor-pointer sm:p-8"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#00C8FF]/10 flex items-center justify-center border border-[#00C8FF]/20 group-hover:bg-[#00C8FF] group-hover:border-[#00C8FF] transition-all duration-500">
                        <IconComp className="w-7 h-7 text-[#00C8FF] group-hover:text-[#050f20] transition-colors" />
                    </div>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-4 tracking-tight group-hover:text-brand-gradient">
                    {industry.title}
                  </h3>

                  <p className="text-white/40 text-[0.9rem] leading-relaxed mb-8 flex-grow font-sans">
                    {industry.description}
                  </p>

                  <div className="space-y-3 mt-auto pt-6 border-t border-white/5">
                    {industry.solutions.map((solution, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[0.8rem] text-white/60 font-medium font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C8FF]/40" />
                        <span>{solution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="mt-10 flex justify-center gap-3 sm:mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-500 focus:outline-none ${
                  currentSlide === index
                    ? "bg-[#00C8FF] w-8 h-2 shadow-[0_0_10px_rgba(0,200,255,0.6)]"
                    : "bg-white/20 w-2 h-2 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Industries;
