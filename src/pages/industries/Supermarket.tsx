import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import supermarketBot from "../../assets/industry/supermarket_bot.png";

const Supermarket: React.FC = () => {
  const features = [
    { title: "Smart Checkout", description: "Cashless and frictionless checkout experience." },
    { title: "Inventory Management", description: "AI-driven demand forecasting and restocking." },
    { title: "Customer Personalization", description: "Tailored offers and recommendations for shoppers." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Supermarket Industry — AI Agent"
      description="Optimizing operations, enhancing customer experience, and improving profitability with AI."
      botImage={supermarketBot}
      botAlt="Supermarket industry AI assistant"
      features={features}
    />
  );
};

export default Supermarket;
