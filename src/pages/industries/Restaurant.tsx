import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import restaurantBot from "../../assets/industry/restaurant_bot.png";

const Restaurant: React.FC = () => {
  const features = [
    { title: "AI Menu Recommendations", description: "Personalized dish recommendations to guests." },
    { title: "Inventory Optimization", description: "Automated stock management and waste reduction." },
    { title: "Dynamic Pricing", description: "Adjust prices based on demand and customer behavior." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Restaurant Industry — AI Agent"
      description="Enhancing guest experience and operational efficiency with AI-driven solutions for restaurants."
      botImage={restaurantBot}
      botAlt="Restaurant industry AI assistant"
      features={features}
    />
  );
};

export default Restaurant;
