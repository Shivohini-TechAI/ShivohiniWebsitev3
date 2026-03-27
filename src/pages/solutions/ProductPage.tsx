// src/pages/solutions/ProductPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import useScrollReveal from '../../hooks/useScrollReveal';

interface Product {
  id: number;
  title: string;
  description: string;
  features: string[];
}

const products: Product[] = [
  {
    id: 1,
    title: "AI Agent",
    description: "Intelligent AI agent for automating tasks and business processes.",
    features: ["Task Automation", "Smart Decision Making", "Analytics Insights"],
  },
  {
    id: 2,
    title: "AI Virtual Assistant",
    description: "Virtual assistant that handles customer queries and personal tasks.",
    features: ["Customer Support", "Scheduling & Reminders", "24/7 Availability"],
  },
  {
    id: 3,
    title: "Face Recognition",
    description: "Advanced AI-based face recognition system for security and authentication.",
    features: ["Secure Authentication", "Visitor Management", "Access Control"],
  },
  {
    id: 4,
    title: "Customized Drones",
    description: "Tailored drones for delivery, surveillance, and other industrial purposes.",
    features: ["Surveillance", "Delivery", "Mapping & Monitoring"],
  },
  {
    id: 5,
    title: "AI Sales Lead Generator",
    description: "Generates high-quality sales leads using intelligent AI algorithms.",
    features: ["Lead Qualification", "Predictive Scoring", "CRM Integration"],
  },
  {
    id: 6,
    title: "Content Creator AI",
    description: "Automatically creates marketing content that resonates with your audience.",
    features: ["Blog Posts", "Social Media Content", "Ad Copy"],
  },
  {
    id: 7,
    title: "Shivohini Virtual Assistant",
    description: "AI assistant that handles customer queries, scheduling, and more.",
    features: ["Chat Support", "Task Automation", "Reminders"],
  },
];

const ProductPage: React.FC = () => {
  useScrollReveal();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === parseInt(id || "", 10));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#050f20]">
        <h1 className="text-3xl font-display font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050f20] px-4 py-24 text-white sm:px-6 sm:py-32">
      {/* Background aurora glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00C8FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#7B61FF]/5 rounded-full blur-[120px]" />
      </div>

      <div data-reveal className="reveal-hidden relative z-10 mx-auto max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="group mb-10 flex items-center gap-2 text-white/40 transition-colors hover:text-[#00C8FF] sm:mb-12"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-widest uppercase">Back to Solutions</span>
        </button>

        <div className="mb-12 text-center sm:mb-16">
          <h1 className="mb-6 text-3xl font-display font-bold tracking-[-0.02em] sm:text-4xl md:mb-8 md:text-6xl">
            {product.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-[1.75] text-white/60 font-sans sm:text-lg md:text-xl">
            {product.description}
          </p>
        </div>

        <div className="mb-12 grid gap-5 sm:mb-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-[12px] transition-all duration-300 hover:border-[#00C8FF]/30 sm:p-8">
              <CheckCircle2 className="w-8 h-8 text-[#00C8FF] mb-2" />
              <p className="text-white font-display font-semibold text-lg">{feature}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/contact")}
            className="rounded-xl bg-[#00C8FF] px-8 py-4 text-base font-bold text-[#050f20] 
              shadow-[0_0_20px_rgba(0,200,255,0.2)] hover:shadow-[0_0_30px_rgba(0,200,255,0.4)] hover:bg-[#00b0e6] transform hover:-translate-y-1 transition-all duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
