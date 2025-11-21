import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import realEstateBot from "../../assets/industry/real-estate_bot.png";

const RealEstate: React.FC = () => {
  const features = [
    { title: "Property Analysis", description: "AI-driven valuation and market prediction." },
    { title: "Virtual Tours", description: "Interactive virtual property exploration." },
    { title: "Client Matching", description: "Match buyers and sellers intelligently." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Real Estate Industry — AI Agent"
      description="Transforming property management, sales, and client engagement with AI solutions."
      botImage={realEstateBot}
      botAlt="Real Estate industry AI assistant"
      features={features}
    />
  );
};

export default RealEstate;
