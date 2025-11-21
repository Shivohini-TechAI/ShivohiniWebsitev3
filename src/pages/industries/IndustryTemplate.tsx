import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

interface Feature {
  title: string;
  description: string;
}

interface IndustryPageProps {
  industryTitle: string;
  description: string;
  features: Feature[];
  buttonText?: string;
  botImage?: string;
  botAlt?: string;
}

const IndustryPage: React.FC<IndustryPageProps> = ({
  industryTitle,
  description,
  features,
  buttonText = "Get Custom Solution",
  botImage,
  botAlt = "AI Assistant",
}) => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0A1A3F] to-[#1E2A78] text-white py-24 px-6 overflow-hidden relative">

      {/* FULL WIDTH TITLE + DESCRIPTION */}
      <div className="container mx-auto max-w-5xl text-center mb-1">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {industryTitle}
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      {/* GRID BELOW TITLE */}
      <div className="container mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SIDE IMAGE */}
        {botImage && (
          <div className="flex justify-center items-start mt-10">
            <img
              src={botImage}
              alt={botAlt}
              className="w-full max-w-md h-auto object-contain animate-float"
            />
          </div>
        )}

        {/* RIGHT SIDE CONTENT */}
        <div>
          {/* FEATURES */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="w-6 h-6 text-cyan-400 mt-1" />
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{f.description}</p>
              </div>
            ))}
          </div>

          {/* BUTTON */}
          <div>
            <button
              onClick={() => navigate("/contact")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustryPage;
