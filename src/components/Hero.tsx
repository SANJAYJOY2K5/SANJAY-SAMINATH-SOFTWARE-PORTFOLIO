import React from 'react';
import { Sparkles, ArrowRight, Brain, MapPin, Mail, Phone, ShieldCheck, Code2, Gamepad2 } from 'lucide-react';

export const Hero: React.FC<{ onOpenGames?: () => void }> = ({ onOpenGames }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden cyber-grid">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Positioning */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Availability Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-card border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span>GRADUATE IN B.TECH AI & DATA SCIENCE (CLASS OF 2026)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.1]">
              Engineering Tools That{' '}
              <span className="gradient-text">See, Hear, & Understand</span>
            </h1>

            {/* Sub-headline positioning with Quote */}
            <div className="space-y-3">
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-light leading-relaxed">
                Hi, I'm <strong className="text-white font-semibold">Sanjay Saminathan</strong>. I build real computer-vision tools, ML classifiers, and generative AI prompt engines — bridging data analytics with intelligent browser interactions.
              </p>

              {/* Quote directly down to his name */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-purple-950/60 to-pink-950/50 border border-cyan-500/40 text-cyan-300 font-mono text-sm shadow-[0_0_25px_rgba(6,182,212,0.25)]">
                <span className="text-amber-400 font-serif text-lg leading-none font-bold">“</span>
                <span className="text-slate-100 font-medium tracking-wide">
                  Better call me <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300 font-heading font-extrabold text-base tracking-wider">"SJ"</span>
                </span>
                <span className="text-amber-400 font-serif text-lg leading-none font-bold">”</span>
                <span className="text-xs text-slate-400 font-mono pl-1 border-l border-slate-700/80 hidden sm:inline">
                  AI & Data Engineer
                </span>
              </div>
            </div>

            {/* Contact quick strip */}
            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400 py-1">
              <div className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Perambalur / Chennai, India</span>
              </div>
              <a
                href="mailto:kishorsanjay2005@gmail.com"
                className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:text-cyan-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>kishorsanjay2005@gmail.com</span>
              </a>
              <a
                href="tel:+917871350761"
                className="flex items-center space-x-1.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 hover:text-cyan-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-green-400" />
                <span>+91 78713 50761</span>
              </a>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#demos"
                className="px-5 sm:px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-heading font-semibold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-[1.02] transition-all flex items-center space-x-2"
              >
                <span>Explore Live Demos</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#games"
                onClick={(e) => {
                  if (onOpenGames) {
                    e.preventDefault();
                    onOpenGames();
                  }
                }}
                className="px-5 sm:px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-heading font-semibold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] hover:scale-[1.02] transition-all flex items-center space-x-2"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>Play Games 🎮</span>
              </a>

              <a
                href="#contact"
                className="px-5 sm:px-6 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-heading font-semibold text-sm border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Hire Sanjay</span>
              </a>
            </div>

            {/* Key Metric Cards Strip */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 max-w-xl">
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <span className="block font-heading font-bold text-2xl text-cyan-400">7.71</span>
                <span className="text-[11px] text-slate-400 font-mono">B.Tech CGPA</span>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <span className="block font-heading font-bold text-2xl text-purple-400">GREATOR</span>
                <span className="text-[11px] text-slate-400 font-mono">SDE Intern ('26)</span>
              </div>
              <div className="glass-card p-3 rounded-xl border border-slate-800">
                <span className="block font-heading font-bold text-2xl text-green-400">2x</span>
                <span className="text-[11px] text-slate-400 font-mono">Industry Internships</span>
              </div>
            </div>

          </div>

          {/* Right Column: Profile Portrait & Tech Stack Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">

              {/* Animated Glowing Ring Behind Portrait */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>

              {/* Card Container */}
              <div className="relative glass-card rounded-3xl p-4 border border-slate-700/60 shadow-2xl flex flex-col items-center">
                
                {/* Profile Photo */}
                <div className="relative w-full h-[360px] rounded-2xl overflow-hidden border border-slate-800 mb-4 bg-slate-900">
                  <img
                    src="/sanjay_profile.jpg"
                    alt="Sanjay Saminathan"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlaid gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent opacity-80" />

                  {/* Overlaid Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                    <span className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-cyan-300 border border-cyan-500/30 flex items-center space-x-1">
                      <Brain className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI & Data ("SJ")</span>
                    </span>
                    <span className="bg-purple-950/85 backdrop-blur-md px-2.5 py-1 rounded-md text-purple-300 border border-purple-500/30 flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Verified Engineer</span>
                    </span>
                  </div>
                </div>

                {/* Info strip under photo */}
                <div className="w-full flex items-center justify-between px-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center space-x-1">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Python • SQL • Power BI</span>
                  </div>
                  <span className="text-emerald-400">● Open for Roles</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
