// src/components/Industries.tsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

import hotelImage from "../assets/industry/hotel.png";
import restaurantImage from "../assets/industry/restaurant.png";
import supermarketImage from "../assets/industry/supermarket.png";
import exportImportImage from "../assets/industry/importExport.png";
import logisticsImage from "../assets/industry/logisticSupply.png";
import educationImage from "../assets/industry/education.png";
import realEstateImage from "../assets/industry/real-estate.png";
import financeImage from "../assets/industry/finance.png";
import hrImage from "../assets/industry/HR.png";
import sportsImage from "../assets/industry/sports.png";

interface Industry {
  id: number;
  title: string;
  description: string;
  image: string;
  solutions: string[];
  route: string;
}

const Industries: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const industries: Industry[] = [
    {
      id: 1,
      title: "Hotel Industry",
      description:
        "AI-powered hotel management systems with smart check-in, personalized guest experiences, and automated operations.",
      image: hotelImage,
      solutions: [
        "AI Agent Integration",
        "Customized Drone for Hotels",
        "Face Recognition System",
        "AI Virtual Assistant",
      ],
      route: "/industries/hotel",
    },
    {
      id: 2,
      title: "Restaurant Industry",
      description:
        "Intelligent restaurant solutions including menu optimization, order management, and customer experience enhancement.",
      image: restaurantImage,
      solutions: [
        "AI Sales Lead Generator",
        "Content Creator AI",
        "Virtual Assistant for Restaurants",
        "AI Marketing Manager",
      ],
      route: "/industries/restaurant",
    },
    {
      id: 3,
      title: "Supermarket",
      description:
        "Smart retail solutions with inventory management, customer behavior analysis, and automated checkout systems.",
      image: supermarketImage,
      solutions: [
        "Advanced Security Systems",
        "AI Inventory Management",
        "Smart Checkout AI",
        "AI Marketing Videos",
      ],
      route: "/industries/supermarket",
    },
    {
      id: 4,
      title: "Export-Import Industry",
      description:
        "AI-driven logistics and trade management with documentation automation and supply chain optimization.",
      image: exportImportImage,
      solutions: [
        "AI Cost Estimator",
        "AI Virtual Assistant for Trade",
        "Route Optimization",
      ],
      route: "/industries/export-import",
    },
    {
      id: 5,
      title: "Logistics & Supply Chain",
      description:
        "Smart logistics solutions with route optimization, warehouse automation, and delivery tracking.",
      image: logisticsImage,
      solutions: [
        "Fleet Management AI",
        "Warehouse Automation",
        "Delivery Tracking System",
        "AI CRM Integration",
      ],
      route: "/industries/logistics",
    },
    {
      id: 6,
      title: "Education Industry",
      description:
        "Educational technology solutions with personalized learning, assessment automation, and student analytics.",
      image: educationImage,
      solutions: [
        "AI Personalized Learning",
        "Student Analytics AI",
        "Virtual Classrooms",
        "Assessment Automation",
      ],
      route: "/industries/education",
    },
    {
      id: 7,
      title: "Real Estate",
      description:
        "Property management and real estate solutions with market analysis, virtual tours, and client matching.",
      image: realEstateImage,
      solutions: [
        "AI Calling Assistant",
        "Virtual Tours",
        "Client Matching AI",
        "AI Marketing Manager",
      ],
      route: "/industries/realestate",
    },
    {
      id: 8,
      title: "Finance & Accounting",
      description:
        "Financial technology solutions with automated bookkeeping, fraud detection, and investment analysis.",
      image: financeImage,
      solutions: [
        "AI Investment Analysis",
        "Automated Bookkeeping",
        "Fraud Detection AI",
        "Risk Management AI",
      ],
      route: "/industries/finance",
    },
    {
      id: 9,
      title: "HR Industry",
      description:
        "Human resource management with AI-powered recruitment, employee analytics, and performance optimization.",
      image: hrImage,
      solutions: [
        "AI Recruitment",
        "Employee Analytics",
        "Performance Optimization",
        "Training Automation",
      ],
      route: "/industries/hr",
    },
    {
      id: 10,
      title: "Sports Department",
      description:
        "Sports analytics and management solutions with performance tracking, fan engagement, and event management.",
      image: sportsImage,
      solutions: [
        "Performance Analytics AI",
        "Fan Engagement AI",
        "Event Management AI",
        "Talent Scouting AI",
      ],
      route: "/industries/sports",
    },
  ];

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(industries.length / itemsPerSlide);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const getCurrentIndustries = () => {
    const start = currentSlide * itemsPerSlide;
    return industries.slice(start, start + itemsPerSlide);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://images.unsplash.com/photo-1581090700227-1e37b190418e?w=1536&h=768&fit=crop"
          alt="Industrial robots and automation"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide">
            Industries We{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">
              Serve
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming businesses across diverse industries with tailored AI
            solutions that drive efficiency, innovation, and growth.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-[-50px] lg:left-[-70px] 
             top-1/3 -translate-y-1/2 z-20 
             bg-white/10 text-white p-3 rounded-full 
             hover:bg-white/20 transition duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-[-50px] lg:right-[-70px]
             top-1/3 -translate-y-1/2 z-20 
             bg-white/10 text-white p-3 rounded-full 
             hover:bg-white/20 transition duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* FIXED HEIGHT GRID */}
          <div
            ref={carouselRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-12 min-h-[500px]"
          >
            {getCurrentIndustries().map((industry) => (
              <div
                key={industry.id}
                onClick={() => navigate(industry.route)}
                className="
                  group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 
                  h-[380px] 
                  hover:bg-white/20 transition-all duration-500 
                  transform hover:-translate-y-4 hover:scale-105 cursor-pointer 
                  flex flex-col justify-between
                "
              >
                <div className="mb-6">
                  <img
                    src={industry.image}
                    alt={industry.title}
                    className="w-20 h-20 object-contain mx-auto"
                  />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {industry.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {industry.description}
                </p>

                <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {industry.solutions.map((solution, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs text-blue-300"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                      {solution}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-blue-400 scale-125"
                    : "bg-white/30"
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
