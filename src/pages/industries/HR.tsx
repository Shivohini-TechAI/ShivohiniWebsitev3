import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import hrBot from "../../assets/industry/HR_bot.png";

const HR: React.FC = () => {
  const features = [
    { title: "Recruitment Automation", description: "AI-assisted candidate sourcing and screening." },
    { title: "Employee Analytics", description: "Track performance and engagement using AI." },
    { title: "Training & Development", description: "Personalized AI learning paths for employees." },
  ];

  return (
    <IndustryTemplate
      industryTitle="HR Industry — AI Agent"
      description="Automating HR operations and enhancing employee experience with AI-driven tools."
      botImage={hrBot}
      botAlt="HR industry AI assistant"
      features={features}
    />
  );
};

export default HR;
