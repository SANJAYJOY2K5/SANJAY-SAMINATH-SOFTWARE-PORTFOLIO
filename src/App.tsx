import React, { useState } from 'react';
import { LoadingMiniGame } from './components/LoadingMiniGame';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 font-body relative overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Loading Mini-Game on initial load */}
      {isLoading && (
        <LoadingMiniGame
          onComplete={() => setIsLoading(false)}
          title="Initializing Cyber Engine..."
          autoDismissMs={3500}
        />
      )}

      {/* Main Portfolio Layout */}
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default App;
