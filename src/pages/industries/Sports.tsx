import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import sportsBot from "../../assets/industry/sports_bot.png";

const Sports: React.FC = () => {
  const features = [
    { title: "Performance Analytics", description: "AI-powered athlete performance tracking." },
    { title: "Training Optimization", description: "Personalized AI training schedules." },
    { title: "Injury Prediction", description: "Predict and prevent injuries using AI insights." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Sports Department — AI Agent"
      description="Enhancing sports performance, training, and management with AI technologies."
      botImage={sportsBot}
      botAlt="Sports industry AI assistant"
      features={features}
    />
  );
};

export default Sports;
