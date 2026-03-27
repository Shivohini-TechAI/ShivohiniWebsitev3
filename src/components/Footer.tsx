import React from 'react';
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ArrowUp,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    company: [
      { name: 'Home', href: '/' },
      { name: 'About Us', href: '/about-us' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact Us', href: '/contact' }
    ],
    solutions: [
      { name: 'AI Voice Assistant', href: '/solutions/4' },
      { name: 'Face Recognition', href: '/solutions/2' },
      { name: 'Customized Drones', href: '/solutions/3' },
      { name: 'Interactive Websites', href: '/solutions/5' }
    ],
    industries: [
      { name: 'Hotel & Restaurant', href: '/industries/hotel' },
      { name: 'Education', href: '/industries/education' },
      { name: 'Finance & Real Estate', href: '/industries/finance' },
      { name: 'Logistics Supply', href: '/industries/logistics' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-[#00C8FF]' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-[#00C8FF]' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-[#00C8FF]' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-[#7B61FF]' }
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-[#050f20] pt-16 text-white sm:pt-20">
      {/* Aurora glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00C8FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7B61FF]/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-16">
            
            {/* Company Info */}
            <div className="space-y-6 lg:col-span-2 sm:space-y-8">
              <Link to="/" onClick={scrollToTop} className="flex items-center gap-4 group">
                <div className="w-14 h-14 bg-white/[0.04] p-2 rounded-xl backdrop-blur-md border border-white/[0.08] group-hover:border-[#00C8FF]/30 transition-all duration-300">
                  <img src={logo} alt="Shivohini TechAI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold tracking-tight">
                    <span className="text-brand-gradient">Shivohini</span>
                    <span className="text-white ml-2">TechAI</span>
                  </h3>
                </div>
              </Link>

              <p className="text-white/60 leading-[1.7] max-w-sm font-sans">
                Transforming businesses through innovative AI solutions.
                We make intelligent technology accessible and practical for
                organizations of all sizes.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/70 hover:text-[#00C8FF] transition-colors font-sans group">
                  <Mail className="w-5 h-5 text-[#00C8FF]" />
                  <a href="mailto:bhatiagunjan27@gmail.com">bhatiagunjan27@gmail.com</a>
                </div>
                <div className="flex items-center gap-4 text-white/70 hover:text-[#00C8FF] transition-colors font-sans">
                  <Phone className="w-5 h-5 text-[#00C8FF]" />
                  <a href="tel:+917688929473">+91-7688929473</a>
                </div>
                <div className="flex items-center gap-4 text-white/70 font-sans">
                  <MapPin className="w-5 h-5 text-[#00C8FF]" />
                  <span>Udaipur, Rajasthan, India</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      className={`w-11 h-11 bg-white/[0.04] rounded-xl flex items-center justify-center backdrop-blur-md border border-white/[0.08] transition-all duration-300 hover:-translate-y-1 ${social.color} hover:border-current`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Columns */}
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:col-span-3 lg:gap-12">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-8">Company</h4>
                <ul className="space-y-4">
                  {footerLinks.company.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.href}
                        onClick={scrollToTop}
                        className="text-white/70 hover:text-[#00C8FF] transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-8">Solutions</h4>
                <ul className="space-y-4">
                  {footerLinks.solutions.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.href}
                        onClick={scrollToTop}
                        className="text-white/70 hover:text-[#00C8FF] transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <h4 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-8">Industries</h4>
                <ul className="space-y-4">
                  {footerLinks.industries.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        to={link.href}
                        onClick={scrollToTop}
                        className="text-white/70 hover:text-[#00C8FF] transition-colors font-sans"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.06] py-8 sm:py-10">
          <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center sm:px-6 md:flex-row md:text-left">
            <p className="text-white/40 text-sm font-sans order-2 md:order-1">
              © {new Date().getFullYear()} Shivohini TechAI. Engineered for excellence.
            </p>
            
            <div className="order-1 flex items-center gap-12 md:order-2">
              <button
                onClick={scrollToTop}
                className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00C8FF] transition-all">
                  <ArrowUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase">Go to top</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
