import React from "react";
import { Lightbulb, Cpu, Users, Rocket, Target, Briefcase, Calendar } from "lucide-react";
import useScrollReveal from '../hooks/useScrollReveal';

const About: React.FC = () => {
  useScrollReveal();

  const stats = [
    { label: "Projects Delivered", value: "50+", icon: Target },
    { label: "Global Industries", value: "10+", icon: Briefcase },
    { label: "Years of Innovation", value: "3+", icon: Calendar }
  ];

  const features = [
    {
      icon: Lightbulb,
      title: "Vision",
      desc: "To empower businesses with intelligent AI solutions that drive innovation and growth.",
    },
    {
      icon: Cpu,
      title: "Mission",
      desc: "Deliver cutting-edge AI technologies, from chatbots to computer vision, making automation accessible and impactful.",
    },
    {
      icon: Users,
      title: "Our Values",
      desc: "Client-centric approach, integrity, creativity, and continuous learning form the foundation of everything we do.",
    },
    {
      icon: Rocket,
      title: "Scalable Solutions",
      desc: "AI architectures designed to grow seamlessly with your business, ensuring reliability and performance at every step.",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-[#050f20] py-20 sm:py-24 lg:py-32"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00C8FF]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7B61FF]/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16">
        <div data-reveal className="reveal-hidden mb-14 max-w-2xl sm:mb-20 lg:mb-24">
          <h2 className="mb-6 text-3xl font-display font-bold leading-tight text-white sm:mb-8 sm:text-4xl lg:text-[3.5rem]">
            Pioneering the <span className="text-brand-gradient">Future</span> of AI Intelligence
          </h2>
          <p className="text-base leading-relaxed text-white/60 font-sans sm:text-lg md:text-xl">
            At Shivohini TechAI, we synchronize creativity, complex data, and deep learning architectures to transform the industrial landscape.
          </p>
        </div>

        {/* Two Column Layout: Image + Text */}
        <div className="mb-20 grid items-center gap-10 sm:gap-12 lg:mb-32 lg:grid-cols-2 lg:gap-20">
          {/* Image Component with Glassmorphism Border */}
          <div data-reveal className="reveal-hidden relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#00C8FF]/20 to-[#7B61FF]/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative p-2 bg-white/[0.05] backdrop-blur-md rounded-[2.5rem] border border-white/10 shadow-2xl">
                <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1536&h=768&fit=crop"
                    alt="Shivohini TechAI Innovation"
                    loading="lazy"
                    className="h-72 w-full rounded-[2rem] object-cover filter brightness-90 contrast-110 sm:h-96 lg:h-[500px]"
                />
            </div>
          </div>

          <div data-reveal className="reveal-hidden space-y-8 sm:space-y-12">
            <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">Redefining Digital Transformation</h3>
                <p className="text-base leading-relaxed text-white/50 font-sans sm:text-lg">
                    We don't just build software; we engineer cognitive assets. Our approach leverages proprietary neural patterns to deliver solutions that are not only intelligent but inherently adaptive to your unique business DNA.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 border-t border-white/5 pt-8 sm:grid-cols-3 sm:gap-8 sm:pt-10">
              {stats.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div key={idx} className="flex flex-col gap-2 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#00C8FF]/10 flex items-center justify-center border border-[#00C8FF]/20 group-hover:border-[#00C8FF]/50 transition-all">
                        <StatIcon className="w-5 h-5 text-[#00C8FF]" />
                      </div>
                      <span className="text-3xl font-display font-bold text-white tracking-tighter">{stat.value}</span>
                    </div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              data-reveal
              className="reveal-hidden group rounded-3xl border border-white/[0.05] bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#00C8FF]/30 sm:p-8 lg:p-10"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-gradient-to-br from-[#00C8FF]/10 to-[#7B61FF]/10 transition-all group-hover:border-[#00C8FF]/30 group-hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] sm:mb-8">
                <Icon className="w-6 h-6 text-[#00C8FF]" />
              </div>
              <h4 className="text-xl font-display font-bold text-white mb-4 tracking-tight">{title}</h4>
              <p className="text-white/40 text-[0.95rem] leading-relaxed font-sans">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
