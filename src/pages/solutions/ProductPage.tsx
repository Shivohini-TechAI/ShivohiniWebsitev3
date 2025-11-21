// src/pages/ProductPage.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === parseInt(id || "", 10));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">
        <h1 className="text-3xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">{product.title}</h1>
        <p className="text-gray-300 text-lg mb-12">{product.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-md">
              <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
              <p className="text-gray-200">{feature}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/Products")}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
        >
          Back to Products
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
