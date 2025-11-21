import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import financeBot from "../../assets/industry/finance_bot.png";

const Finance: React.FC = () => {
  const features = [
    { title: "Automated Accounting", description: "AI-assisted bookkeeping and reporting." },
    { title: "Fraud Detection", description: "Real-time fraud alerts and risk assessment." },
    { title: "Financial Analytics", description: "AI-driven insights for smarter decision-making." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Finance & Accounting — AI Agent"
      description="Improving accuracy, efficiency, and strategic insights in finance operations with AI."
      botImage={financeBot}
      botAlt="Finance industry AI assistant"
      features={features}
    />
  );
};

export default Finance;
