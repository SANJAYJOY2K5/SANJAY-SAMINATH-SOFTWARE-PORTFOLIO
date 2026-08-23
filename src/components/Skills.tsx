import React from 'react';
import { BarChart3, Palette, Brain, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

export const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Languages & Querying",
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      skills: [
        { name: "Python", level: "Advanced", detail: "Data analysis, OpenCV, TensorFlow, Scripting" },
        { name: "SQL", level: "Advanced", detail: "Complex queries, data filtering, join optimization" },
        { name: "Data Modeling", level: "Intermediate", detail: "Relational schema design & ETL logic" },
      ]
    },
    {
      title: "Analytics & Power BI",
      icon: <BarChart3 className="w-5 h-5 text-purple-400" />,
      skills: [
        { name: "Power BI", level: "Expert", detail: "Interactive dashboards, DAX queries, BI reporting" },
        { name: "Microsoft Excel", level: "Advanced", detail: "Pivot tables, VLOOKUP, statistical modeling" },
        { name: "Data Visualization", level: "Expert", detail: "Transforming raw data into executive insights" },
      ]
    },
    {
      title: "AI & Computer Vision",
      icon: <Brain className="w-5 h-5 text-pink-400" />,
      skills: [
        { name: "Prompt Engineering", level: "Expert", detail: "Gemini API, LLM fine-tuning, image-to-prompt" },
        { name: "Computer Vision", level: "Advanced", detail: "MediaPipe (Hands & FaceMesh), OpenCV" },
        { name: "TensorFlow & ML", level: "Intermediate", detail: "MobileNet CNN image classifiers" },
      ]
    },
    {
      title: "Design & Visualization",
      icon: <Palette className="w-5 h-5 text-green-400" />,
      skills: [
        { name: "Figma", level: "Advanced", detail: "UI/UX wireframing & interactive prototypes" },
        { name: "Adobe Photoshop", level: "Advanced", detail: "Graphic design & media manipulation" },
        { name: "Canva & Video Editing", level: "Advanced", detail: "Technical symposium posters & promotional video editing" },
      ]
    }
  ];

  return (
    <section id="skills" className="py-24 relative bg-[#070a12] border-t border-slate-900">
      {/* Glow effect */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Skills & <span className="gradient-text">Core Competencies</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            A balanced technical stack spanning data analytics, machine learning, computer vision, and visual interface design.
          </p>
        </div>

        {/* Skill Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-white">
                  {cat.title}
                </h3>
              </div>

              <div className="space-y-4">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-heading font-semibold text-sm text-slate-100 flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>{skill.name}</span>
                      </span>
                      <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono rounded-md border border-cyan-500/20">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-light pl-6">
                      {skill.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
