import React from 'react';
import { GraduationCap, Briefcase, Trophy, Award, CheckCircle2, ChevronRight, Sparkles, BookOpen, Layers } from 'lucide-react';

export const About: React.FC = () => {
  const achievements = [
    "1st Prize — Inter-Department Project Competition (Sri Ramakrishna College of Engineering)",
    "1st Prize — Intra-Department Paper Presentation",
    "2x Coordinator — National-Level Technical Symposium (Poster Presentation - Technical Event)",
    "Active Participant in multiple national-level technical symposiums across South India",
  ];

  const certifications = [
    { title: "Data Analysis", issuer: "Naan Mudhalvan" },
    { title: "Power BI Masterclass", issuer: "Office Master" },
    { title: "Automation Testing", issuer: "GUVI (with HCL)" },
    { title: "Application Developer & Web Mobile", issuer: "State Skill Mission" },
    { title: "Adobe Photoshop", issuer: "Naan Mudhalvan" },
    { title: "Advertising Strategy", issuer: "Naan Mudhalvan" },
  ];

  return (
    <section id="about" className="py-24 relative bg-[#070a12] border-t border-slate-900">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Background & Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            About <span className="gradient-text">Sanjay Saminathan</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            AI & Data Analytics graduate specializing in transforming complex data streams into automated tools, computer-vision models, and action-oriented dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Education & Internship Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Education Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Academic Qualifications</h3>
                  <span className="text-xs text-slate-400 font-mono">2019 – 2026</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* B.Tech */}
                <div className="relative pl-6 border-l-2 border-cyan-500/50">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <h4 className="font-heading font-semibold text-lg text-white">
                      B.Tech in Artificial Intelligence & Data Science
                    </h4>
                    <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-mono rounded-md border border-cyan-400/30">
                      CGPA: 7.71 / 10
                    </span>
                  </div>
                  <p className="text-sm text-cyan-400 font-medium mt-1">
                    Sri Ramakrishna College of Engineering, Perambalur
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Focused on Computer Vision, Machine Learning algorithms, Data Modeling, SQL Database design, and Neural Networks.
                  </p>
                </div>

                {/* HSC */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading font-medium text-slate-200">
                      Higher Secondary Certificate (HSC - Class XII)
                    </h4>
                    <span className="text-xs font-mono text-slate-400">71.17%</span>
                  </div>
                  <p className="text-xs text-slate-400">Meenakshi Ramasamy Matriculation & Higher Secondary School (2021–2022)</p>
                </div>

                {/* SSLC */}
                <div className="relative pl-6 border-l-2 border-slate-800">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-700" />
                  <div className="flex justify-between items-center">
                    <h4 className="font-heading font-medium text-slate-200">
                      Secondary School Certificate (SSLC - Class X)
                    </h4>
                    <span className="text-xs font-mono text-slate-400">80.4%</span>
                  </div>
                  <p className="text-xs text-slate-400">Annai Theresa Matriculation School, Jayankondam (2019–2020)</p>
                </div>
              </div>
            </div>

            {/* Internship Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Work & Internship Experience</h3>
                  <span className="text-xs text-slate-400 font-mono">Industry Practice</span>
                </div>
              </div>

              <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h4 className="font-heading font-semibold text-lg text-white">Data Analyst Intern</h4>
                    <span className="text-xs text-purple-400 font-mono">ZANE Analytics</span>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono rounded-md border border-purple-400/30">
                    Hands-on Data Role
                  </span>
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Gained practical experience in real-world data collection, cleaning, and ETL pipelines.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Assisted in building interactive Power BI dashboards and analytical reports for management decision-making.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>Worked directly with structured & un-structured datasets to extract business performance insights.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          {/* Achievements & Certifications Column */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Achievements Card */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Key Achievements</h3>
                  <span className="text-xs text-slate-400 font-mono">Recognitions & Leadership</span>
                </div>
              </div>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-900/40 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Grid */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-xl text-white">Certifications & Courses</h3>
                  <span className="text-xs text-slate-400 font-mono">Specialized Up-skilling</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-xs font-semibold text-white mb-1">{cert.title}</span>
                    <span className="text-[10px] text-green-400 font-mono">{cert.issuer}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
