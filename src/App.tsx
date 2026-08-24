import React, { useState, useEffect } from 'react';
import { LoadingMiniGame } from './components/LoadingMiniGame';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { CyberArcade } from './components/CyberArcade';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { GamePage } from './components/GamePage';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'portfolio' | 'games'>('portfolio');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#games' || hash === '#arcade-hub') {
        setCurrentView('games');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setCurrentView('portfolio');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: 'portfolio' | 'games', sectionId?: string) => {
    setCurrentView(view);
    if (view === 'games') {
      window.location.hash = '#games';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (sectionId) {
        window.location.hash = `#${sectionId}`;
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        window.location.hash = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-body relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Loading Mini-Game on initial load */}
      {isLoading && (
        <LoadingMiniGame
          onComplete={() => setIsLoading(false)}
          title="Initializing SJ Cyber Engine..."
          autoDismissMs={3200}
        />
      )}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* View Switcher: Full Game Station Page vs Main Portfolio */}
      {currentView === 'games' ? (
        <main>
          <GamePage onBack={() => handleNavigate('portfolio')} />
        </main>
      ) : (
        <main>
          <Hero onOpenGames={() => handleNavigate('games')} />
          <About />
          <Projects />
          <Skills />
          <CyberArcade onOpenGameHub={() => handleNavigate('games')} />
          <ContactForm />
        </main>
      )}

      <Footer />
    </div>
  );
};

export default App;
