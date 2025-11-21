import React from "react";
import IndustryPage from "./IndustryTemplate";
import hotelBot from "../../assets/industry/hotel_bot.png";

const Hotel: React.FC = () => {
  const features = [
    { title: "Smart Check-in/out", description: "Frictionless guest onboarding using conversational AI." },
    { title: "Guest Personalization", description: "Dynamic recommendations and in-room personalization." },
    { title: "Room Automation", description: "Voice and mobile control for lighting, temperature and services." },
    { title: "Revenue Optimization", description: "Dynamic pricing driven by demand forecasting." },
    { title: "Sentiment Analysis", description: "Analyze reviews and feedback to improve service." },
    { title: "Ops Automation", description: "Automate housekeeping and maintenance schedules." },
  ];

  return (
    <IndustryPage
      industryTitle="Hotel Industry — AI Agent"
      description="Smart hospitality: automated check-in/out, guest personalization, room automation and revenue optimization powered by AI agents."
      botImage={hotelBot}
      botAlt="Hotel industry AI assistant"
      features={features}
      buttonText="Get Custom Hotel Solution"
    />
  );
};

export default Hotel;
