import React, { useState, lazy, Suspense } from 'react';
import { CaseStudyCard } from './projects/CaseStudyCard';
import { Sparkles, Layers, Eye, Hand, Image as ImageIcon, RefreshCw } from 'lucide-react';

// Code-split heavy vision & AI demo modules to optimize initial page load performance
const HandGestureMouseDemo = lazy(() =>
  import('./demos/HandGestureMouseDemo').then((mod) => ({ default: mod.HandGestureMouseDemo }))
);
const EyeGestureMouseDemo = lazy(() =>
  import('./demos/EyeGestureMouseDemo').then((mod) => ({ default: mod.EyeGestureMouseDemo }))
);
const PromptEngineDemo = lazy(() =>
  import('./demos/PromptEngineDemo').then((mod) => ({ default: mod.PromptEngineDemo }))
);

export const Projects: React.FC = () => {
  const [activeDemoTab, setActiveDemoTab] = useState<'hand' | 'eye' | 'prompt'>('hand');

  return (
    <section id="demos" className="py-24 relative bg-[#070a12] border-t border-slate-900">
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Vision & AI Demos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-bold text-white">
            Working Engineering <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Try Sanjay's computer-vision tools and generative AI modules live right in your browser. All gesture models run 100% locally client-side.
          </p>
        </div>

        {/* Live Demo Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="glass-card p-1.5 rounded-2xl border border-slate-800 flex flex-wrap justify-center gap-1 max-w-2xl w-full">
            
            <button
              onClick={() => setActiveDemoTab('hand')}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeDemoTab === 'hand'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>1. Hand Gesture Mouse</span>
            </button>

            <button
              onClick={() => setActiveDemoTab('eye')}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeDemoTab === 'eye'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>2. Eye Gesture Control</span>
            </button>

            <button
              onClick={() => setActiveDemoTab('prompt')}
              className={`flex-1 min-w-[150px] py-3 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2 ${
                activeDemoTab === 'prompt'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>3. PromptEngine AI</span>
            </button>

          </div>
        </div>

        {/* Active Demo Container with Suspense Fallback */}
        <div className="mb-20">
          <Suspense
            fallback={
              <div className="glass-card rounded-3xl p-12 border border-slate-800 text-center flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <span className="text-xs font-mono text-slate-300">
                  Loading vision demo module...
                </span>
              </div>
            }
          >
            {activeDemoTab === 'hand' && <HandGestureMouseDemo />}
            {activeDemoTab === 'eye' && <EyeGestureMouseDemo />}
            {activeDemoTab === 'prompt' && <PromptEngineDemo />}
          </Suspense>
        </div>

        {/* Case Studies Section Header */}
        <div id="projects" className="pt-12 border-t border-slate-900">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5" />
              <span>Software & Machine Learning Case Studies</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-heading font-bold text-white">
              Mobile & ML System Builds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CaseStudyCard
              id="sleep-tracker"
              title="Sleep Tracker Application"
              year="2024"
              subtitle="Android application designed to track, calculate, and analyze sleep cycles automatically upon activation."
              category="Android App & Mobile Dev"
              techStack={['Android Studio', 'Java', 'SQLite', 'XML UI', 'Background Services']}
              problem="Users struggle to accurately log sleep duration and detect disrupted sleeping habits manually without expensive wearable hardware."
              approach="Engineered a native Android background service leveraging sensor activity and auto-time calculation once activated by the user. Integrated local SQLite database for historical sleep trend analysis."
              impact="Delivered a zero-cost, privacy-first mobile application that automatically computes nightly rest metrics without cloud dependency."
              icon="android"
              imagePlaceholder="https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800&auto=format&fit=crop&q=80"
            />

            <CaseStudyCard
              id="animal-classifier"
              title="Animal Type Species Classifier"
              year="2024"
              subtitle="Machine learning computer-vision model engineered to identify animal species from camera & image feeds."
              category="Computer Vision & Deep Learning"
              techStack={['Python', 'TensorFlow', 'OpenCV', 'MobileNet', 'NumPy']}
              problem="Wildlife research, conservationists, and agricultural monitors need rapid automated image classification to track species."
              approach="Trained a lightweight Convolutional Neural Network (CNN) using MobileNet backbone transfer learning and OpenCV pre-processing to process image streams at high frame rates."
              impact="Achieved robust classification precision across diverse animal species with low computing overhead suitable for edge deployment."
              icon="ml"
              imagePlaceholder="https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&auto=format&fit=crop&q=80"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
