import React from 'react';
import { ArrowUp, Mail, Heart, Code2, MapPin } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#05070d] border-t border-slate-900 py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <span className="font-heading font-bold text-lg text-white tracking-wider">
              SANJAY <span className="text-cyan-400">SAMINATHAN</span>
            </span>
            <p className="text-xs text-slate-400 font-mono">
              B.Tech Artificial Intelligence & Data Science Engineer (2022–2026)
            </p>
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-mono pt-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Perambalur / Chennai, Tamil Nadu, India</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.linkedin.com/in/sanjay-saminathan-6908202a3"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-xl border border-slate-800 transition-colors"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/SANJAYJOY2K5"
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-xl border border-slate-800 transition-colors"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
            <a
              href="mailto:kishorsanjay2005@gmail.com"
              className="p-3 bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 rounded-xl border border-slate-800 transition-colors"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 rounded-xl border border-slate-800 transition-colors flex items-center space-x-1 text-xs font-mono"
          >
            <span>Top</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-8 pt-8 border-t border-slate-900/80 text-center text-xs font-mono text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} Sanjay Saminathan. All rights reserved.</span>
          <span className="flex items-center space-x-1">
            <span>Built with</span>
            <Code2 className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>React + TypeScript & MediaPipe</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
