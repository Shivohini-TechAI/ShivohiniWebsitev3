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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Solutions", path: "/solutions" },
    { name: "Industries", path: "/industries" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-[#050a19]/75 backdrop-blur-[16px] border-b border-white/[0.06] ${
        isScrolled ? "py-2" : "py-3 sm:py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        {/* 🔹 Logo Section */}
        <Link
          to="/"
          onClick={() => setIsMenuOpen(false)}
          className="group flex min-w-0 items-center gap-3 transition-transform duration-300 hover:scale-105"
        >
          <div className="relative">
            <img
              src={logo}
              alt="Shivohini TechAI Logo"
              className="h-10 w-10 shrink-0 transition-all duration-500 drop-shadow-[0_0_12px_rgba(0,200,255,0.4)] group-hover:drop-shadow-[0_0_18px_rgba(123,97,255,0.6)] sm:h-11 sm:w-11 md:h-12 md:w-12"
            />
          </div>
          <span
            className="truncate text-base font-display font-bold tracking-tight text-white transition-all duration-500 sm:text-xl lg:text-2xl"
          >
            Shivohini TechAI
          </span>
        </Link>

        {/* 🔸 Desktop Navbar */}
        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-sm uppercase tracking-[0.03em] font-medium transition-all duration-300 ${
                  isActive ? "text-[#00C8FF]" : "text-white/70 hover:text-white"
                } after:content-[''] after:absolute after:-bottom-[4px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-gradient-to-r after:from-[#00C8FF] after:to-[#7B61FF] after:transition-all after:duration-300 ${
                  isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 🔸 Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-white transition-colors duration-500 focus:outline-none md:hidden"
          aria-label="Toggle Navigation Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🔸 Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#050a19]/95 backdrop-blur-[16px] border-b border-white/[0.06] shadow-xl animate-fadeIn transition-all duration-500">
          <nav className="flex max-h-[calc(100svh-5rem)] flex-col gap-3 overflow-y-auto px-4 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-2xl border px-4 py-3 text-base tracking-[0.03em] font-medium transition-all duration-300 ${
                    isActive
                      ? "border-[#00C8FF]/40 bg-[#00C8FF]/10 text-[#00C8FF]"
                      : "border-white/5 text-white/70 hover:border-white/10 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
