import React, { useEffect, useRef } from "react";
import discoveryImage from "../assets/process/Discovery_&_AI_Strategy_Call.png";
import assessmentImage from "../assets/process/Data&Process_Assessment.png";
import developmentImage from "../assets/process/CustomAI_Solution_Development.png";
import deploymentImage from "../assets/process/Deployment_Training&Optimization.png";

const Process: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-show");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".reveal-hidden");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: 1,
      title: "Discovery & AI Strategy Call",
      description:
        "We understand your goals, workflows, and pain points to identify high-impact AI use cases.",
      image: discoveryImage,
    },
    {
      number: 2,
      title: "Data & Process Assessment",
      description:
        "Our experts review your data, tools, and systems to design the right AI architecture and integrations.",
      image: assessmentImage,
    },
    {
      number: 3,
      title: "Custom AI Solution Development",
      description:
        "We build and integrate tailored AI agents, chatbots, and automation for your industry.",
      image: developmentImage,
    },
    {
      number: 4,
      title: "Deployment, Training & Optimization",
      description:
        "We launch the solution, train your team, and continuously optimize for accuracy, speed, and ROI.",
      image: deploymentImage,
    },
  ];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-[#3E4C9A] via-[#2C3B7A] to-[#1B2A5A] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16 reveal-hidden">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white tracking-wide">
            How Our AI Solution{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">
              Process Works
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            From discovery to deployment, we guide you through every step of your AI transformation journey.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-400/60 via-blue-500/60 to-cyan-400/60 rounded-full opacity-70 pointer-events-none" />

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.number}
                  className={`reveal-hidden grid lg:grid-cols-2 gap-8 items-center ${
                    isEven ? "" : "lg:grid-flow-dense"
                  }`}
                >
                  <div
                    className={`group relative ${isEven ? "" : "lg:col-start-2"}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-48 md:h-56 object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>

                  <div
                    className={`group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,224,255,0.4)] hover:-translate-y-2 ${
                      isEven ? "" : "lg:col-start-1 lg:row-start-1"
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4 group-hover:scale-110 transition-transform duration-500">
                        {step.number}
                      </div>
                      <h3 className="text-2xl font-semibold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex justify-center reveal-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full blur-xl opacity-50"></div>
            <div className="relative h-2 w-64 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
