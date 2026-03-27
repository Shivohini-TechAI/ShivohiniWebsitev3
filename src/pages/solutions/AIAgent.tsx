import React from "react";
import { Cpu, Bot, Brain, Workflow } from "lucide-react";

const AIAgent: React.FC = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0B1120] via-[#0A1A3F] to-[#020617] px-4 pb-16 pt-28 text-white overflow-hidden sm:px-6 sm:pb-20 sm:pt-32">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-20 right-1/3 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full animate-pulse delay-700" />

      <div className="relative z-10 container mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent sm:text-5xl">
          AI Agent
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-base text-gray-300 sm:mb-12 sm:text-lg">
          Shivohini TechAI’s <strong>AI Agents</strong> are autonomous systems capable of 
          understanding tasks, learning continuously, and making real-time data-driven 
          decisions. They seamlessly automate workflows to enhance efficiency.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {[
            { icon: Brain, title: "Self-Learning" },
            { icon: Workflow, title: "Task Automation" },
            { icon: Cpu, title: "Data-Driven Decisions" },
            { icon: Bot, title: "Conversational Intelligence" },
          ].map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="group bg-white/5 border border-white/10 rounded-3xl p-6 hover:shadow-[0_0_25px_rgba(0,224,255,0.3)] transition-all duration-500"
            >
              <Icon className="w-10 h-10 text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIAgent;
