import React from "react";
import IndustryTemplate from "./IndustryTemplate";
// import logisticsImage from "../../assets/industry/logisticSupply.png";

const Logistics: React.FC = () => {
  const features = [
    { title: "Route Optimization", description: "Minimize delivery times and fuel consumption." },
    { title: "Fleet Monitoring", description: "Track vehicles in real-time with predictive AI alerts." },
    { title: "Warehouse Automation", description: "AI-assisted storage and inventory handling." },
  ];

  return (
    <IndustryTemplate
     industryTitle="Logistics & Supply Chain — AI Agent"
      description="Efficient, optimized, and automated supply chain management using AI-driven tools."
    //   image={logisticsImage}
      features={features}
    />
  );
};

export default Logistics;
