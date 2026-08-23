import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Live Demos', href: '#demos' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070a12]/85 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center space-x-3 group text-slate-100 font-heading font-bold text-lg tracking-wider"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px] shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070a12] rounded-[11px] flex items-center justify-center">
                <span className="gradient-text font-black text-sm">SS</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="group-hover:text-cyan-400 transition-colors">
                SANJAY <span className="text-cyan-400">SAMINATHAN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest font-normal">
                AI & DATA ENGINEER
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-full transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://www.linkedin.com/in/sanjay-saminathan-6908202a3"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/SANJAYJOY2K5"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold rounded-xl group bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105"
            >
              <span className="relative px-4 py-2 transition-all ease-in duration-75 bg-[#070a12] rounded-[10px] group-hover:bg-opacity-0 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white" />
                <span>Hire Sanjay</span>
              </span>
            </a>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-cyan-400 rounded-xl bg-slate-900/80 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-3 pb-6 mt-2 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 text-base font-medium text-slate-200 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-xl transition-colors"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <div className="flex space-x-3">
              <a
                href="https://www.linkedin.com/in/sanjay-saminathan-6908202a3"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-cyan-400"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/SANJAYJOY2K5"
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-400 hover:text-cyan-400"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-xs font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
