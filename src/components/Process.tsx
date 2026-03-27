import React from "react";
import discoveryImage from "../assets/process/Discovery_&_AI_Strategy_Call.png";
import assessmentImage from "../assets/process/Data&Process_Assessment.png";
import developmentImage from "../assets/process/CustomAI_Solution_Development.png";
import deploymentImage from "../assets/process/Deployment_Training&Optimization.png";
import useScrollReveal from '../hooks/useScrollReveal';

const Process: React.FC = () => {
  useScrollReveal();

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
    <section id="process" className="relative overflow-hidden bg-[#050f20] py-20 sm:py-24">
      {/* Background aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#00C8FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-[#7B61FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16">
        <div data-reveal className="reveal-hidden mb-14 text-center sm:mb-20 lg:mb-24">
          <h2 className="mb-6 text-3xl font-bold tracking-[-0.02em] text-white font-display sm:text-4xl lg:text-[3.2rem]">
            How Our AI Solution <span className="text-brand-gradient">Process Works</span>
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-[1.75] text-white/60 font-sans sm:text-lg">
            From discovery to deployment, we guide you through every step of your AI transformation journey.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline center line */}
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-50 pointer-events-none" />

          <div className="space-y-12 sm:space-y-16 lg:space-y-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={step.number}
                  data-reveal
                  className={`reveal-hidden grid items-center gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 ${isEven ? "" : "lg:grid-flow-dense"}`}
                >
                  {/* Image Part */}
                  <div className={`group relative ${isEven ? "" : "lg:col-start-2"}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-[#00C8FF]/30 transition-all duration-700 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="h-[220px] w-full object-cover filter transition-all duration-700 group-hover:grayscale-0 sm:h-[260px] md:h-[300px]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050f20]/60 to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />
                    </div>
                  </div>

                  {/* Content Part */}
                  <div
                    className={`group rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-[12px] transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#00C8FF]/40 hover:shadow-[0_12px_32px_rgba(0,200,255,0.1)] sm:p-8 md:p-10 ${isEven ? "" : "lg:col-start-1 lg:row-start-1"}`}
                  >
                    <div className="mb-5 flex items-start gap-4 sm:mb-6 sm:items-center sm:gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00C8FF] text-xl font-black text-[#050f20] shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-transform duration-500 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-2xl">
                        {step.number}
                      </div>
                      <h3 className="text-xl font-display font-bold text-white transition-colors duration-300 group-hover:text-[#00C8FF] sm:text-2xl">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-base leading-[1.7] text-white/60 font-sans sm:text-[1.05rem]">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div data-reveal className="reveal-hidden mt-16 flex justify-center sm:mt-24">
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-[#00C8FF]/30 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Process;
