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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#020617] via-[#0A1A3F] to-[#1E2A78] px-4 py-20 text-white sm:px-6 sm:py-24">

      {/* FULL WIDTH TITLE + DESCRIPTION */}
      <div className="container mx-auto mb-6 max-w-5xl text-center sm:mb-8">
        <h1 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-6xl">
          {industryTitle}
        </h1>

        <p className="mx-auto max-w-3xl text-base text-gray-300 sm:text-lg md:text-xl">
          {description}
        </p>
      </div>

      {/* GRID BELOW TITLE */}
      <div className="container mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">

        {/* LEFT SIDE IMAGE */}
        {botImage && (
          <div className="mt-6 flex justify-center items-start sm:mt-10">
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
          <div className="mb-10 grid gap-5 md:grid-cols-2 md:gap-6 sm:mb-12">
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
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3.5 font-semibold shadow-lg transition hover:scale-[1.02] sm:w-auto"
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
