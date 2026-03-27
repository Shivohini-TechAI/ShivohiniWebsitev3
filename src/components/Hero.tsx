import React from 'react';
import { ArrowRight } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import videoFile from "../assets/Logo_Animate_V1.mp4";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  useScrollReveal();
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-dark-900 bg-aurora pb-14 pt-28 sm:pb-16 sm:pt-32"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">

          {/* Text Content */}
          <div data-reveal className="reveal-hidden space-y-6 text-center lg:text-left">
            {/* Pill Badge */}


            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[4.2rem]">
                Transforming Ideas into <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C8FF] to-[#7B61FF]">
                  Intelligent Solutions
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-[1.75] text-white/65 font-sans sm:text-lg lg:mx-0">
                Shivohini TechAI revolutionizes businesses with cutting-edge AI technology,
                custom solutions, and innovative automation across all industries.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start">
              <button
                onClick={() => navigate("/solutions")}
                className="group flex w-full items-center justify-center rounded-xl bg-[#00C8FF] px-6 py-4 text-base font-semibold text-[#050f20] shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all duration-300 hover:bg-[#00b0e6] hover:shadow-[0_0_35px_rgba(0,200,255,0.5)] sm:w-auto sm:px-8 sm:text-lg">
                Explore Our Solutions
                <ArrowRight className="inline-block md:ml-2 ml-3 w-5 h-5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Right Side Video Section */}
          <div
            data-reveal
            className="reveal-hidden relative flex items-center justify-center pt-2 sm:pt-6 lg:pt-0"
          >
            {/* CLEAN BLENDED HOLOGRAM VIDEO */}
            <div className="relative flex aspect-square w-full max-w-md items-center justify-center sm:max-w-xl md:aspect-video lg:max-w-2xl lg:aspect-square">
              <video
                src={videoFile}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full scale-105 object-cover opacity-90 sm:scale-110 lg:scale-125"
                style={{
                  mixBlendMode: "screen",
                  maskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
                  WebkitMaskImage: "radial-gradient(circle at center, black 40%, transparent 70%)",
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Background overlapping gradient fade to next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-b from-transparent to-[#050f20] sm:h-32" />
    </section>
  );
};

export default Hero;
