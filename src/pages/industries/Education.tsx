import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import educationBot from "../../assets/industry/education_bot.png";

const Education: React.FC = () => {
  const features = [
    { title: "Personalized Learning", description: "Tailored study plans and resources for students." },
    { title: "AI Grading & Assessment", description: "Automated grading and analytics for teachers." },
    { title: "Virtual Tutors", description: "Interactive AI tutors for 24/7 assistance." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Education Industry — AI Agent"
      description="Enhancing teaching and learning with AI-driven personalized and automated solutions."
      botImage={educationBot}
      botAlt="Education industry AI assistant"
      features={features}
    />
  );
};

export default Education;
