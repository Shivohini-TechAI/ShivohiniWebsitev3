import React from "react";
import { Lightbulb, Cpu, Users, Rocket } from "lucide-react";

const About: React.FC = () => {
  const features = [
    {
      icon: Lightbulb,
      title: "Vision",
      desc: "To empower businesses with intelligent AI solutions that drive innovation and growth.",
    },
    {
      icon: Cpu,
      title: "Mission",
      desc: "Deliver cutting-edge AI technologies, from chatbots to computer vision, making automation accessible and impactful.",
    },
    {
      icon: Users,
      title: "Our Values",
      desc: "Client-centric approach, integrity, creativity, and continuous learning form the foundation of everything we do.",
    },
    {
      icon: Rocket,
      title: "Scalable Solutions",
      desc: "AI architectures designed to grow seamlessly with your business, ensuring reliability and performance at every step.",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 bg-gradient-to-b from-[#1B2A5A] via-[#2C3B7A] to-[#3E4C9A] overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-white tracking-wide">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-cyan-500">Shivohini TechAI</span>
          </h2>
        </div>

        {/* Two Column Layout: Image + Text */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1536&h=768&fit=crop"
              alt="AI team collaborating in a modern office"
              className="w-full h-auto rounded-3xl shadow-2xl object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-gray-300 text-lg leading-relaxed">
              At Shivohini TechAI, we combine creativity, data, and deep learning to build AI solutions that transform businesses.
              From intelligent chatbots to scalable computer vision systems, our team focuses on innovation, automation, and growth.
            </p>
          </div>
        </div>

        {/* Features / Vision, Mission, Values, Growth */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={i}
              className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,224,255,0.4)] hover:-translate-y-2"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-gray-300">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;