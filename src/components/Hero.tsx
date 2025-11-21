import React, { useEffect, useState } from 'react';
import { Brain, Zap, Cpu, ArrowRight } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import videoFile from "../assets/Logo_Animate_V1.mp4";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  useScrollReveal();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden 
      bg-gradient-to-br from-[#0a0f1c] via-[#0d2338] to-[#1c3c63]"
    >

      {/* Gold glow matching video */}
      <div className="absolute right-0 top-0 w-[60%] h-full 
        bg-gradient-to-l from-yellow-400/20 to-transparent opacity-70"></div>

      {/* Soft blue neon overlay */}
      <div className="absolute right-0 top-0 w-[50%] h-full 
        bg-gradient-to-l from-cyan-400/10 to-transparent"></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Brain className="w-8 h-8 text-cyan-400/60" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delayed">
          <Zap className="w-6 h-6 text-blue-400/60" />
        </div>
        <div className="absolute bottom-1/3 left-1/3 animate-float-slow">
          <Cpu className="w-10 h-10 text-purple-400/60" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div data-reveal className="reveal-hidden space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
                Transforming Ideas into <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-gradient">
                  Intelligent Solutions
                </span>
              </h1>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0">
                Shivohoni TechAI revolutionizes businesses with cutting-edge AI technology,
                custom solutions, and innovative automation across all industries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
              onClick={() => navigate("/solutions")}
              className="group bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 
                text-white px-8 py-4 rounded-2xl font-semibold text-lg 
                hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 
                transform hover:scale-105 transition-all duration-300 shadow-xl">
                Explore Our Solutions
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* <button className="border-2 border-cyan-400 text-cyan-400 
                px-8 py-4 rounded-2xl font-semibold text-lg 
                hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white 
                transition-all duration-300 shadow-lg">
                Watch Demo
              </button> */}
            </div>
          </div>

          {/* Right Side Video Section */}
          <div
            data-reveal
            className="reveal-hidden relative flex items-center justify-center"
          >
            {/* HOLOGRAPHIC VIDEO WITH ADVANCED GLOW EFFECTS */}
            {/* CLEAN BLENDED HOLOGRAM VIDEO */}
            <div className="relative w-[1020px] h-[480px] flex items-center justify-center">

              <video
                src={videoFile}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-[0.82]"
                style={{
                  mixBlendMode: "screen",
                  maskImage:
                    "radial-gradient(circle at center, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(circle at center, black 60%, transparent 100%)",
                }}
              />

              {/* Subtle gradient behind video for smoother blending */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-300/5 to-transparent blur-[0px] -z-10"></div>

            </div>

          </div>


        </div>
      </div>
    </section>
  );
};

export default Hero;
