// src/components/Products.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  features?: string[];
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const products: Product[] = [
    {
      id: 1,
      title: "AI Agent",
      description: "An intelligent AI agent to automate business operations.",
      features: ["Automates tasks", "AI powered insights"],
    },
    {
      id: 2,
      title: "Face Recognition",
      description: "Advanced facial recognition system for security and analytics.",
      features: ["Security solution", "Attendance tracking"],
    },
    {
      id: 3,
      title: "Customized Drones",
      description: "Tailor-made drones for business and industrial applications.",
      features: ["Aerial monitoring", "Customized design"],
    },
    {
      id: 4,
      title: "AI Virtual Assistant",
      description: "Virtual assistant to manage tasks and customer queries.",
      features: ["Task management", "Customer support"],
    },
    {
      id: 5,
      title: "Interactive Websites",
      description: "Websites with interactive features and AI integration.",
      features: ["Personalized UX", "AI Chatbot Integration"],
    },
    {
      id: 6,
      title: "AI Sales Lead Generator",
      description: "Systematically discovers, qualifies, and delivers high-conversion sales prospects.",
      features: ["Targeted Prospecting", "CRM Integration"],
    },
    {
      id: 7,
      title: "Content Creator AI",
      description: "Automatically creates marketing content for multiple formats.",
      features: ["Multi-format Output", "SEO Optimization"],
    },
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const getCurrentProducts = () => {
    const start = currentSlide * itemsPerSlide;
    return products.slice(start, start + itemsPerSlide);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-64 lg:h-full opacity-10">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1536&h=768&fit=crop"
          alt="Futuristic AI interface with multiple screens"
          className="w-full h-full object-cover rounded-bl-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 tracking-wide">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">Products</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming businesses with tailored AI solutions across various domains.
          </p>
        </div>

        <div className="relative">
          {/* Carousel Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
            {getCurrentProducts().map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-6 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 cursor-pointer"
              >
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {product.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>

                {product.features && (
                  <div className="space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs text-blue-300"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-blue-400 scale-125" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
