import React from "react";
import IndustryTemplate from "./IndustryTemplate";
import exportImportBot from "../../assets/industry/importExport_bot.png";

const ExportImport: React.FC = () => {
  const features = [
    { title: "Trade Forecasting", description: "Predict market trends and optimize import/export operations." },
    { title: "Logistics Automation", description: "AI-driven supply chain management." },
    { title: "Custom Compliance", description: "Automate paperwork and customs processes." },
  ];

  return (
    <IndustryTemplate
      industryTitle="Export-Import Industry — AI Agent"
      description="Streamlining international trade and logistics with intelligent AI solutions."
      botImage={exportImportBot}
      botAlt="Export-Import industry AI assistant"
      features={features}
    />
  );
};

export default ExportImport;
