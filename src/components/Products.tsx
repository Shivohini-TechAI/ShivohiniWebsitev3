// src/components/Products.tsx
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { products } from "../data/products";
import { useNavigate } from "react-router-dom";
import useScrollReveal from '../hooks/useScrollReveal';

const getItemsPerSlide = () => {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1280) return 2;
  return 3;
};

const Products: React.FC = () => {
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

  const totalSlides = Math.ceil(products.length / itemsPerSlide);

  useEffect(() => {
    setCurrentSlide((prev) => Math.min(prev, Math.max(totalSlides - 1, 0)));
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const currentProducts = products.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="relative overflow-hidden bg-[#050f20] py-20 sm:py-24 lg:py-32">
      {/* Background aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-[#00C8FF]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#7B61FF]/3 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-16">
        {/* Section Header */}
        <div data-reveal className="reveal-hidden mb-14 max-w-2xl sm:mb-20 lg:mb-24">
          <h2 className="mb-6 text-3xl font-display font-bold leading-tight text-white sm:mb-8 sm:text-4xl lg:text-[3.5rem]">
            Our Intelligent <span className="text-brand-gradient">Solutions</span>
          </h2>
          <p className="text-base leading-relaxed text-white/50 font-sans sm:text-lg md:text-xl">
            Engineered cognitive products designed to automate complexity and redefine operational excellence.
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
                aria-label="Previous products"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] focus:outline-none sm:h-12 sm:w-12 md:absolute md:left-0 md:top-1/2 md:-translate-x-4 md:-translate-y-1/2 lg:-translate-x-14"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                onClick={nextSlide}
                aria-label="Next products"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white shadow-2xl transition-all duration-500 hover:scale-110 hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] focus:outline-none sm:h-12 sm:w-12 md:absolute md:right-0 md:top-1/2 md:translate-x-4 md:-translate-y-1/2 lg:translate-x-14"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className={`grid items-stretch gap-5 sm:gap-6 lg:gap-8 ${itemsPerSlide === 1 ? "grid-cols-1" : itemsPerSlide === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
            {currentProducts.map((product, i) => (
              <div
                key={product.id}
                data-reveal
                className="reveal-hidden group flex flex-col rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl
                  hover:border-[#00C8FF]/30 transition-all duration-500
                  hover:-translate-y-3 shadow-2xl cursor-default sm:p-8 lg:rounded-[2.5rem] lg:p-10"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Image */}
                <div className="relative mb-8 flex h-[180px] shrink-0 items-center justify-center sm:mb-10 sm:h-[200px]">
                  <div className="absolute inset-0 bg-[#00C8FF]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_0_20px_rgba(0,200,255,0.2)] group-hover:scale-110 transition-transform duration-700 relative z-10"
                  />
                </div>

                <h3 className="mb-4 text-xl font-display font-bold tracking-tight text-white group-hover:text-brand-gradient sm:text-2xl">
                  {product.title}
                </h3>

                <p className="text-white/40 text-[0.95rem] leading-relaxed mb-8 flex-grow font-sans">
                  {product.description}
                </p>

                <div className="space-y-4 mt-auto pt-8 border-t border-white/5">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-[0.85rem] text-white/60 font-medium font-sans">
                      <div className="w-2 h-2 rounded-full bg-[#00C8FF]/40 border border-[#00C8FF]/20" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group/btn mt-8 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] py-4 text-sm font-bold text-white shadow-xl transition-all hover:border-[#00C8FF] hover:bg-[#00C8FF] hover:text-[#050f20] sm:mt-10"
                >
                  Architect Detail <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex justify-center gap-3 sm:mt-12">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`rounded-full transition-all duration-500 focus:outline-none ${currentSlide === index
                    ? "bg-[#00C8FF] w-10 h-2 shadow-[0_0_10px_rgba(0,200,255,0.6)]"
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

export default Products;
