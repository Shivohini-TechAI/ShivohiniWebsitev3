// ✅ Static product data — extracted from component for clean separation of concerns.
// Import images here so Vite can bundle and optimize them at build time.

import aiAgentImage from "../assets/products/AI_agent-min (1).png";
import aiSalesLeadImage from "../assets/products/AI_Sales_Lead_Generator-min (1).png";
import aiVirtualImage from "../assets/products/AI_Virtual_Assistant-min (1).png";
import contentCreatorImage from "../assets/products/Content_Creator_AI-min (1).png";
import customizedDroneImage from "../assets/products/Customized_Drones-min (1).png";
import faceRecoImage from "../assets/products/Face_Recognition-min (1).png";
import interactiveWebsiteImage from "../assets/products/Interactive_Websites-min (1).png";

export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: 1,
    title: "AI Agent",
    description: "An intelligent AI agent to automate business operations and workflows.",
    image: aiAgentImage,
    features: ["Automates tasks", "AI powered insights"],
  },
  {
    id: 2,
    title: "Face Recognition",
    description: "Advanced facial recognition system for security and analytics.",
    image: faceRecoImage,
    features: ["Security solution", "Attendance tracking"],
  },
  {
    id: 3,
    title: "Customized Drones",
    description: "Tailor-made drones for business and industrial applications.",
    image: customizedDroneImage,
    features: ["Aerial monitoring", "Customized design"],
  },
  {
    id: 4,
    title: "AI Virtual Assistant",
    description: "Virtual assistant to manage tasks and customer queries.",
    image: aiVirtualImage,
    features: ["Task management", "Customer support"],
  },
  {
    id: 5,
    title: "Interactive Websites",
    description: "Websites with interactive features and AI integration.",
    image: interactiveWebsiteImage,
    features: ["Personalized UX", "AI Chatbot Integration"],
  },
  {
    id: 6,
    title: "AI Sales Lead Generator",
    description: "Discovers, qualifies, and delivers high-conversion sales prospects.",
    image: aiSalesLeadImage,
    features: ["Targeted Prospecting", "CRM Integration"],
  },
  {
    id: 7,
    title: "Content Creator AI",
    description: "Automatically creates marketing content for multiple formats.",
    image: contentCreatorImage,
    features: ["Multi-format Output", "SEO Optimization"],
  },
];
