import React from 'react';
import { 
  Mail, 
  Phone, 
  // MapPin, 
  // Globe, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Brain,
  ArrowUp
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Our Team', href: '#team' },
      { name: 'Careers', href: '/careers' },
      { name: 'News & Media', href: '#news' }
    ],
    services: [
      { name: 'AI Agent', href: '/solutions' },
      { name: 'Face Recognition', href: '/solutions' },
      { name: 'Custom Drones', href: '/solutions' },
      { name: 'Virtual Assistant', href: '/solutions' },
      { name: 'Interactive Websites', href: '/solutions' }
    ],
    industries: [
      { name: 'Hotel & Hospitality', href: '/industries' },
      { name: 'Education', href: '/industries' },
      { name: 'Healthcare', href: '/industries' },
      { name: 'Finance', href: '/industries' },
      { name: 'Real Estate', href: '/industries' }
    ],
    support: [
      { name: 'Help Center', href: '/contact' },
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'System Status', href: '#status' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-600' }
  ];

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">
                    <span className="text-blue-400">Shivohoni</span>
                    <span className="text-white ml-1">TechAI</span>
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Transforming businesses through innovative AI solutions. 
                We make intelligent technology accessible and practical for 
                organizations of all sizes.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/40 transition-colors duration-300">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <a 
                    href="mailto:bhatiagunjan27@gmail.com" 
                    className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
                  >
                    bhatiagunjan27@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600/40 transition-colors duration-300">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <a 
                    href="tel:+917688929473" 
                    className="text-gray-300 hover:text-green-400 transition-colors duration-300"
                  >
                    +91-7688929473
                  </a>
                </div>

                {/* <div className="flex items-center space-x-3 group">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/40 transition-colors duration-300">
                    <Globe className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-gray-300">
                    Global AI Solutions
                  </span>
                </div> */}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-blue-400">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-purple-400">Services</h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Industries Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-teal-400">Industries</h4>
              <ul className="space-y-3">
                {footerLinks.industries.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-orange-400">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
                <p className="text-gray-400">Get the latest AI insights and updates delivered to your inbox.</p>
              </div>
              
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-80 px-4 py-3 bg-white/10 border border-gray-600 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-r-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Shivohoni TechAI. All rights reserved. | 
                <a href="#privacy" className="hover:text-blue-400 transition-colors duration-300 ml-1">Privacy Policy</a> | 
                <a href="#terms" className="hover:text-blue-400 transition-colors duration-300 ml-1">Terms of Service</a>
              </p>
              
              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm">Back to Top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;