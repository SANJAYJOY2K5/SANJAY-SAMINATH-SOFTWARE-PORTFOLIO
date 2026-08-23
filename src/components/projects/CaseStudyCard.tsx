import React, { useState } from 'react';
import { Smartphone, Brain, ExternalLink, Code2, ChevronDown, ChevronUp, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CaseStudyProps {
  id: string;
  title: string;
  year: string;
  subtitle: string;
  category: string;
  techStack: string[];
  problem: string;
  approach: string;
  impact: string;
  icon: 'android' | 'ml';
  imagePlaceholder: string;
}

export const CaseStudyCard: React.FC<CaseStudyProps> = ({
  title,
  year,
  subtitle,
  category,
  techStack,
  problem,
  approach,
  impact,
  icon,
  imagePlaceholder,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all group flex flex-col justify-between">
      <div>
        {/* Top Tag & Year */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              {icon === 'android' ? <Smartphone className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wide block">{category}</span>
              <span className="text-[10px] text-slate-500 font-mono">{year}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-slate-900 text-slate-300 text-xs font-mono rounded-full border border-slate-800">
            Case Study
          </span>
        </div>

        {/* Title & Pitch */}
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed mb-4">
          {subtitle}
        </p>

        {/* Visual Banner */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden mb-6 bg-slate-950 border border-slate-800">
          <img
            src={imagePlaceholder}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a12] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {techStack.map((tech, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-slate-950/90 text-cyan-300 text-[10px] font-mono rounded-md border border-cyan-500/30">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Concise Problem & Approach preview */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <strong className="text-cyan-400 font-mono block mb-1">🎯 Problem:</strong>
            <p className="text-slate-300 font-light">{problem}</p>
          </div>
        </div>

        {/* Expandable Case Study Deep Dive */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs sm:text-sm animate-fadeIn">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <strong className="text-purple-400 font-mono block mb-1">⚡ Engineering Approach:</strong>
              <p className="text-slate-300 font-light">{approach}</p>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <strong className="text-emerald-400 font-mono block mb-1">🚀 Key Outcome & Impact:</strong>
              <p className="text-slate-300 font-light">{impact}</p>
            </div>
          </div>
        )}
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono rounded-xl border border-slate-800 transition-colors flex items-center justify-center space-x-1.5"
      >
        <span>{isExpanded ? 'Hide Case Study Details' : 'Read Full Engineering Case Study'}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
      </button>
    </div>
  );
};
