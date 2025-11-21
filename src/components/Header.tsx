import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Solutions", path: "/solutions" },
    { name: "Industries", path: "/industries" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/#blog" },
  ];

  const handleNavClick = (path: string) => {
    if (path === "/#blog") {
      // Scroll to blog section on home page
      const blogElement = document.getElementById('blog');
      if (blogElement) {
        blogElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4 transition-all duration-500">
        {/* 🔹 Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105"
        >
          <div className="relative">
            <img
              src={logo}
              alt="Shivohini TechAI Logo"
              className={`w-11 h-11 md:w-12 md:h-12 transition-all duration-500 ${
                isScrolled
                  ? "drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              } group-hover:drop-shadow-[0_0_18px_rgba(147,51,234,0.6)]`}
            />
          </div>
          <span
            className={`text-2xl font-bold tracking-tight transition-all duration-500 ${
              isScrolled
                ? "text-slate-900"
                : "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
            }`}
          >
            Shivohini TechAI
          </span>
        </Link>

        {/* 🔸 Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`relative text-lg font-medium transition-all duration-300 ${
                location.pathname === item.path || (item.path === "/#blog" && location.pathname === "/" && location.hash === "#blog")
                  ? isScrolled
                    ? "text-blue-600"
                    : "text-white"
                  : isScrolled
                  ? "text-gray-700 hover:text-blue-600"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.name}
              {(location.pathname === item.path || (item.path === "/#blog" && location.pathname === "/" && location.hash === "#blog")) && (
                <span
                  className={`absolute left-1/2 -bottom-2 w-3/5 h-[3px] rounded-full transform -translate-x-1/2 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse ${
                    isScrolled
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
                  }`}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* 🔸 Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden focus:outline-none transition-colors duration-500 ${
            isScrolled ? "text-slate-900" : "text-white"
          }`}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 🔸 Mobile Menu Panel */}
      {isMenuOpen && (
        <div
          className={`md:hidden absolute top-full left-0 w-full backdrop-blur-lg shadow-lg animate-fadeIn transition-all duration-500 ${
            isScrolled ? "bg-white/95" : "bg-slate-900/90"
          }`}
        >
          <nav className="flex flex-col items-center py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-lg font-medium transition-all duration-300 ${
                  location.pathname === item.path || (item.path === "/#blog" && location.pathname === "/" && location.hash === "#blog")
                    ? isScrolled
                      ? "text-blue-600"
                      : "text-cyan-400"
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => {
                  handleNavClick(item.path);
                  setIsMenuOpen(false);
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;