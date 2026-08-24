import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Gamepad2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { SJLogo } from './SJLogo';

interface NavbarProps {
  currentView?: 'portfolio' | 'games';
  onNavigate?: (view: 'portfolio' | 'games', sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'portfolio',
  onNavigate,
}) => {
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
    { name: 'About', href: '#about', view: 'portfolio' as const },
    { name: 'Live Demos', href: '#demos', view: 'portfolio' as const },
    { name: 'Projects', href: '#projects', view: 'portfolio' as const },
    { name: 'Skills', href: '#skills', view: 'portfolio' as const },
    { name: 'Arcade Hub 🎮', href: '#games', view: 'games' as const, isGame: true },
    { name: 'Contact', href: '#contact', view: 'portfolio' as const },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (onNavigate) {
      e.preventDefault();
      if (link.isGame) {
        onNavigate('games');
      } else {
        onNavigate('portfolio', link.href.replace('#', ''));
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#070a12]/90 backdrop-blur-md border-b border-slate-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.6)] py-2.5'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <a
            href="#"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('portfolio');
              }
            }}
            className="flex items-center space-x-3 group text-slate-100 font-heading font-bold text-lg tracking-wider"
          >
            {/* Custom SJ Vector 3D Logo */}
            <div className="relative w-10 h-10 rounded-xl bg-slate-900/90 border border-cyan-500/30 p-1 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:scale-105 group-hover:border-cyan-400/60 transition-all duration-300 flex items-center justify-center">
              <SJLogo size={32} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="group-hover:text-cyan-400 transition-colors">
                  SANJAY <span className="text-cyan-400">SAMINATHAN</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold tracking-tight">
                  "SJ"
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-normal flex items-center space-x-1">
                <span>AI & DATA ENGINEER</span>
                <span className="text-cyan-400">•</span>
                <span className="text-slate-300 italic hidden sm:inline">"Better call me SJ"</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 glass-card px-4 py-1.5 rounded-full border border-slate-800/80">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
                  link.isGame
                    ? currentView === 'games'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'text-amber-300 hover:text-white hover:bg-purple-600/20 border border-purple-500/30'
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                }`}
              >
                {link.isGame && <Gamepad2 className="w-3.5 h-3.5 text-amber-300 animate-pulse" />}
                <span>{link.name}</span>
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
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('portfolio', 'contact');
                }
              }}
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
              onClick={(e) => handleLinkClick(e, link)}
              className={`block px-4 py-2.5 text-base font-medium rounded-xl transition-colors ${
                link.isGame
                  ? 'bg-purple-600/20 text-amber-300 border border-purple-500/30 font-semibold'
                  : 'text-slate-200 hover:text-cyan-400 hover:bg-cyan-500/10'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 flex items-center justify-between border-t border-slate-800">
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
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('portfolio', 'contact');
                }
                setMobileMenuOpen(false);
              }}
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
