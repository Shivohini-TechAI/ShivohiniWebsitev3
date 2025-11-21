import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import logisticsBot from "../../assets/industry/logisticSupply_bot.png";

const Logistics: React.FC = () => {
  const features = [
    { title: "Route Optimization", description: "Minimize delivery times and fuel consumption with AI." },
    { title: "Fleet Monitoring", description: "Track vehicles in real-time with predictive AI alerts." },
    { title: "Warehouse Automation", description: "AI-assisted storage and inventory handling." },
    { title: "Demand Forecasting", description: "Predict supply chain demands with machine learning." },
    { title: "AI CRM Integration", description: "Seamlessly integrate customer management with logistics." },
    { title: "Smart Analytics", description: "Data-driven insights for supply chain optimization." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Logistics & Supply Chain — AI Agent"
      description="Efficient, optimized, and automated supply chain management using AI-driven tools for route planning, fleet tracking, and warehouse operations."
      botImage={logisticsBot}
      botAlt="Logistics industry AI assistant"
      features={features}
    />
  );
};

export default Logistics;
