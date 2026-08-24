import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Gamepad2, Trophy, Volume2, VolumeX, Maximize2, Minimize2, 
  RotateCcw, Sparkles, Zap, Flame, Shield, Award, Terminal, Play, Cpu, Crosshair
} from 'lucide-react';
import { SJLogo } from './SJLogo';

interface GamePageProps {
  onBack: () => void;
}

export const GamePage: React.FC<GamePageProps> = ({ onBack }) => {
  const [activeGame, setActiveGame] = useState<'runner' | 'shooter' | 'memory'>('runner');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Audio synthesizer
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  const playSound = useCallback((freq: number, type: OscillatorType = 'sine', duration = 0.15) => {
    if (!soundEnabledRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context restricted until interaction
    }
  }, []);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#05070d] text-slate-100 font-body relative overflow-x-hidden pt-20 pb-20 cyber-grid"
    >
      {/* Background Neon Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-600/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-20">
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          
          {/* Back Button & Brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 rounded-xl border border-cyan-500/30 transition-all flex items-center space-x-2 text-xs font-mono group hover:scale-105 shadow-md"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Portfolio</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="flex items-center space-x-3">
              <SJLogo size={32} />
              <div>
                <h1 className="text-base sm:text-lg font-heading font-extrabold text-white tracking-wider flex items-center space-x-2">
                  <span>SJ CYBER ARCADE</span>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-pink-500 to-purple-600 text-[10px] font-mono rounded-md text-white font-bold">
                    PRO ENGINE
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono hidden md:block">
                  "Better call me SJ" • Interactive Engineering Playground
                </p>
              </div>
            </div>
          </div>

          {/* Quick Audio & Fullscreen settings */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Sound Enabled' : 'Sound Muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-purple-400 border border-slate-800 hover:border-purple-500/40 transition-all"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Page Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Game Switcher Tabs */}
        <div className="flex justify-center">
          <div className="glass-card p-1.5 rounded-2xl border border-slate-800 flex flex-wrap justify-center gap-2 max-w-3xl w-full shadow-xl">
            <button
              onClick={() => {
                setActiveGame('runner');
                playSound(440, 'sine', 0.1);
              }}
              className={`flex-1 min-w-[180px] py-3.5 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2.5 ${
                activeGame === 'runner'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.45)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>1. Cyber Runner 2077</span>
            </button>

            <button
              onClick={() => {
                setActiveGame('shooter');
                playSound(520, 'triangle', 0.1);
              }}
              className={`flex-1 min-w-[180px] py-3.5 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2.5 ${
                activeGame === 'shooter'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Crosshair className="w-4 h-4 text-pink-300" />
              <span>2. Neural Space Defender</span>
            </button>

            <button
              onClick={() => {
                setActiveGame('memory');
                playSound(600, 'sine', 0.1);
              }}
              className={`flex-1 min-w-[180px] py-3.5 px-4 rounded-xl text-xs font-heading font-semibold transition-all flex items-center justify-center space-x-2.5 ${
                activeGame === 'memory'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.45)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-300" />
              <span>3. Cyber Memory Matrix</span>
            </button>
          </div>
        </div>

        {/* Active Game View Area */}
        <div className="transition-all duration-300">
          {activeGame === 'runner' && <RunnerGame soundEnabled={soundEnabled} playSound={playSound} />}
          {activeGame === 'shooter' && <ShooterGame soundEnabled={soundEnabled} playSound={playSound} />}
          {activeGame === 'memory' && <MemoryGame soundEnabled={soundEnabled} playSound={playSound} />}
        </div>

        {/* Global Gaming Stats & Badges Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Engine Framework</span>
              <h4 className="text-sm font-heading font-bold text-white">HTML5 Canvas 60 FPS</h4>
              <p className="text-[11px] text-slate-500 font-mono">Realtime client-side physics loop</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Audio Engine</span>
              <h4 className="text-sm font-heading font-bold text-white">Web Audio Synthesizer</h4>
              <p className="text-[11px] text-slate-500 font-mono">Realtime programmatic synth tones</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center space-x-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-mono uppercase">Persistent Scores</span>
              <h4 className="text-sm font-heading font-bold text-white">Local Storage Vault</h4>
              <p className="text-[11px] text-slate-500 font-mono">High scores auto-saved in your browser</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* =========================================================================
   GAME 1: CYBER RUNNER 2077
   ========================================================================= */
const RunnerGame: React.FC<{
  soundEnabled: boolean;
  playSound: (freq: number, type?: OscillatorType, duration?: number) => void;
}> = ({ playSound }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('sanjay_runner_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [coins, setCoins] = useState(0);
  const [difficulty, setDifficulty] = useState<'Normal' | 'Hyper' | 'Matrix'>('Normal');

  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;
  const isGameOverRef = useRef(false);
  isGameOverRef.current = isGameOver;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;

  const jumpRef = useRef<() => void>(() => {});

  const handleStart = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setCoins(0);
    playSound(523.25, 'triangle', 0.2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    let localScore = 0;
    let localCoins = 0;

    const groundY = 240;
    let playerY = groundY;
    let playerVelY = 0;
    let jumps = 2;
    const gravity = 0.65;

    interface Obstacle {
      x: number;
      width: number;
      height: number;
      speed: number;
      type: 'laser' | 'drone' | 'spikes';
    }

    interface Coin {
      x: number;
      y: number;
      radius: number;
      collected: boolean;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
      size: number;
    }

    let obstacles: Obstacle[] = [];
    let coinItems: Coin[] = [];
    let particles: Particle[] = [];
    let spawnTimer = 0;
    let coinTimer = 0;

    const spawnParticles = (x: number, y: number, color: string, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          color,
          life: 0,
          maxLife: 25 + Math.random() * 15,
          size: Math.random() * 3.5 + 1.5,
        });
      }
    };

    jumpRef.current = () => {
      if (!isPlayingRef.current || isGameOverRef.current) return;
      if (jumps > 0) {
        playerVelY = jumps === 2 ? -12.5 : -10.5;
        jumps--;
        playSound(400 + (2 - jumps) * 200, 'square', 0.12);
        spawnParticles(80, playerY + 20, '#06b6d4', 8);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!isPlayingRef.current || isGameOverRef.current) {
          handleStart();
        } else {
          jumpRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKey);

    const loop = () => {
      animId = requestAnimationFrame(loop);
      frame++;

      const w = canvas.width;
      const h = canvas.height;

      // Dark background
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, w, h);

      // Floor line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 24);
      ctx.lineTo(w, groundY + 24);
      ctx.stroke();

      // Floor grid moving effect
      const speedMult = difficultyRef.current === 'Hyper' ? 1.4 : difficultyRef.current === 'Matrix' ? 1.8 : 1.0;
      const baseSpeed = (4.8 + Math.min(localScore * 0.003, 5)) * speedMult;
      const gridOffset = (frame * (4 * speedMult)) % 40;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
      for (let x = -gridOffset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 24);
        ctx.lineTo(x - 25, h);
        ctx.stroke();
      }

      // Background Cyber Silhouettes
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      for (let bx = 0; bx < w; bx += 90) {
        const bHeight = 50 + ((bx * 31) % 70);
        ctx.fillRect(bx, groundY + 24 - bHeight, 60, bHeight);
        ctx.fillStyle = ((bx / 90 + frame) % 6 === 0) ? 'rgba(6, 182, 212, 0.4)' : 'rgba(236, 72, 153, 0.25)';
        ctx.fillRect(bx + 12, groundY + 24 - bHeight + 15, 4, 4);
        ctx.fillRect(bx + 35, groundY + 24 - bHeight + 25, 4, 4);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      }

      if (!isPlayingRef.current && !isGameOverRef.current) {
        // Idle Bot
        const hover = Math.sin(frame * 0.08) * 4;
        drawRunnerBot(ctx, 80, groundY + hover, false, frame);
        return;
      }

      if (isGameOverRef.current) {
        renderParticles(ctx, particles);
        return;
      }

      // Physics
      playerVelY += gravity;
      playerY += playerVelY;
      if (playerY >= groundY) {
        playerY = groundY;
        playerVelY = 0;
        jumps = 2;
      }

      // Score
      if (frame % 4 === 0) {
        localScore += Math.floor(1 * speedMult);
        setScore(localScore);
      }

      // Spawn Obstacles
      spawnTimer++;
      const spawnInterval = Math.max(65 - Math.floor(localScore * 0.015), 36);
      if (spawnTimer > spawnInterval) {
        spawnTimer = 0;
        const types: ('laser' | 'drone' | 'spikes')[] = ['laser', 'drone', 'spikes'];
        const chosen = types[Math.floor(Math.random() * types.length)];
        obstacles.push({
          x: w + 20,
          width: chosen === 'drone' ? 24 : 18,
          height: chosen === 'spikes' ? 32 : chosen === 'drone' ? 22 : 28,
          speed: baseSpeed,
          type: chosen,
        });
      }

      // Spawn Coins
      coinTimer++;
      if (coinTimer > 85) {
        coinTimer = 0;
        coinItems.push({
          x: w + 20,
          y: Math.random() > 0.5 ? groundY - 45 : groundY - 15,
          radius: 7,
          collected: false,
        });
      }

      // Move & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= obs.speed;
        const obsY = groundY + 24 - obs.height;

        if (obs.type === 'laser') {
          ctx.fillStyle = '#ec4899';
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 10;
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(obs.x + 4, obsY + 4, obs.width - 8, obs.height - 8);
        } else if (obs.type === 'drone') {
          const floatY = Math.sin(frame * 0.15 + i) * 8;
          ctx.fillStyle = '#a855f7';
          ctx.shadowColor = '#a855f7';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY - 15 + floatY, obs.width / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#22d3ee';
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obsY - 15 + floatY, 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 8;
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.strokeStyle = '#fca5a5';
          ctx.strokeRect(obs.x, obsY, obs.width, obs.height);
        }

        ctx.shadowBlur = 0;

        // Collision box
        const pBox = { x: 80 - 12, y: playerY - 12, w: 24, h: 28 };
        const oBox = {
          x: obs.x,
          y: obs.type === 'drone' ? obsY - 25 : obsY,
          w: obs.width,
          h: obs.height,
        };

        if (
          pBox.x < oBox.x + oBox.w &&
          pBox.x + pBox.w > oBox.x &&
          pBox.y < oBox.y + oBox.h &&
          pBox.y + pBox.h > oBox.y
        ) {
          setIsGameOver(true);
          playSound(150, 'sawtooth', 0.35);
          spawnParticles(80, playerY, '#ec4899', 24);
          spawnParticles(80, playerY, '#06b6d4', 20);
          setHighScore((prev) => {
            const next = Math.max(prev, localScore);
            try {
              localStorage.setItem('sanjay_runner_highscore', next.toString());
            } catch {
              // ignore
            }
            return next;
          });
        }

        if (obs.x < -40) obstacles.splice(i, 1);
      }

      // Coins
      for (let i = coinItems.length - 1; i >= 0; i--) {
        const c = coinItems[i];
        c.x -= baseSpeed;

        if (!c.collected) {
          const pulse = Math.sin(frame * 0.2 + i) * 2;
          ctx.fillStyle = '#06b6d4';
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(c.x, c.y + pulse, c.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(c.x, c.y + pulse, c.radius * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          if (Math.hypot(80 - c.x, playerY - c.y) < 26) {
            c.collected = true;
            localCoins += 1;
            localScore += 50;
            setCoins(localCoins);
            setScore(localScore);
            playSound(780, 'sine', 0.15);
            spawnParticles(c.x, c.y, '#06b6d4', 10);
            coinItems.splice(i, 1);
            continue;
          }
        }

        if (c.x < -20) coinItems.splice(i, 1);
      }

      // Player Bot & Particles
      drawRunnerBot(ctx, 80, playerY, jumps < 2, frame);
      renderParticles(ctx, particles);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKey);
    };
  }, [playSound]);

  const drawRunnerBot = (ctx: CanvasRenderingContext2D, x: number, y: number, airborne: boolean, frame: number) => {
    ctx.save();

    // 1. Dual Repulsor Boot Thrusters & Plasma Flames
    const flameHeight = airborne ? 18 + Math.sin(frame * 0.8) * 5 : 8 + Math.sin(frame * 0.5) * 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';

    const gradFlame = ctx.createLinearGradient(x - 6, y + 14, x - 14 - flameHeight, y + 17);
    gradFlame.addColorStop(0, '#ffffff');
    gradFlame.addColorStop(0.3, '#00f0ff');
    gradFlame.addColorStop(0.7, '#f59e0b');
    gradFlame.addColorStop(1, '#ef4444');

    ctx.fillStyle = gradFlame;
    ctx.beginPath();
    ctx.moveTo(x - 6, y + 14);
    ctx.lineTo(x - 14 - flameHeight, y + 17);
    ctx.lineTo(x - 6, y + 20);
    ctx.closePath();
    ctx.fill();

    // 2. Iron Man Legs (Gold & Crimson Armor)
    const legOffset = airborne ? 2 : Math.sin(frame * 0.35) * 4;
    // Back leg
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(x - 8, y + 10, 6, 8 + legOffset);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x - 8, y + 13, 6, 3);

    // Front leg
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x - 1, y + 10, 6, 8 - legOffset);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x - 1, y + 13, 6, 3);

    // 3. Iron Man Torso / Chestplate (Hot Rod Red & Gold Titanium)
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x - 11, y - 2, 22, 16, 4);
    ctx.fill();
    ctx.stroke();

    // Gold Abdominal & Collar Plates
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x - 7, y - 2, 14, 3);
    ctx.fillRect(x - 6, y + 8, 12, 4);

    // 4. Glowing RT / Arc Reactor (Center Chest)
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';
    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(x, y + 3, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y + 3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Armored Shoulder Pads & Arms (Forward hero stance)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x - 10, y + 1, 4, 0, Math.PI * 2);
    ctx.arc(x + 10, y + 1, 4, 0, Math.PI * 2);
    ctx.fill();

    // Right Hand & Palm Repulsor
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + 7, y + 2, 7, 5);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00f0ff';
    ctx.fillRect(x + 13, y + 3, 2, 3);
    ctx.shadowBlur = 0;

    // 6. Mini Iron Man Helmet (Crimson Dome + Gold Faceplate)
    ctx.fillStyle = '#b91c1c';
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x - 10, y - 17, 20, 16, 5);
    ctx.fill();
    ctx.stroke();

    // Gold Faceplate
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 14);
    ctx.lineTo(x + 6, y - 14);
    ctx.lineTo(x + 7, y - 5);
    ctx.lineTo(x + 4, y - 2);
    ctx.lineTo(x - 4, y - 2);
    ctx.lineTo(x - 7, y - 5);
    ctx.closePath();
    ctx.fill();

    // Glowing Cyan Visor Eyes
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 5, y - 9, 3.5, 2);
    ctx.fillRect(x + 1.5, y - 9, 3.5, 2);

    ctx.restore();
  };

  const renderParticles = (ctx: CanvasRenderingContext2D, list: any[]) => {
    ctx.save();
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      const alpha = 1 - p.life / p.maxLife;
      if (p.life >= p.maxLife) {
        list.splice(i, 1);
        continue;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(alpha, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl space-y-4">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">SCORE:</span>
            <span className="font-heading font-bold text-lg text-cyan-300">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">HIGH:</span>
            <span className="font-heading font-bold text-lg text-amber-300">{highScore.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span className="text-slate-400">ORBS:</span>
            <span className="font-bold text-pink-300">{coins}</span>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          {(['Normal', 'Hyper', 'Matrix'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1 rounded-md text-[11px] transition-colors ${
                difficulty === d ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div
        onClick={() => {
          if (!isPlaying || isGameOver) handleStart();
          else jumpRef.current();
        }}
        className="relative w-full h-[340px] rounded-2xl overflow-hidden bg-[#070a12] border border-slate-800 cursor-pointer select-none"
      >
        <canvas ref={canvasRef} width={800} height={340} className="w-full h-full object-cover" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-[#070a12]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30 animate-pulse">
              <Gamepad2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
                CYBER RUNNER 2077
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light">
                Press <strong className="text-cyan-400 font-mono">SPACE / TAP SCREEN</strong> to Jump • Double-Tap for Double-Jump!
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white font-heading font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>START RUN</span>
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-[#070a12]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-2xl border border-pink-500/40">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-heading font-extrabold text-white">GAME OVER</h3>
            <div className="flex items-center space-x-6 text-xs font-mono bg-slate-900/80 px-6 py-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">SCORE</span>
                <span className="font-bold text-lg text-cyan-300">{score}</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">HIGH</span>
                <span className="font-bold text-lg text-amber-300">{highScore}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-200">Space / ↑</span>
          <span>Jump</span>
          <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-cyan-300">2x Jump</span>
          <span>Double Jump</span>
        </div>
        <span className="text-slate-500">Collect cyan energy orbs (+50)</span>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: NEURAL SPACE DEFENDER (CYBER SHOOTER)
   ========================================================================= */
const ShooterGame: React.FC<{
  soundEnabled: boolean;
  playSound: (freq: number, type?: OscillatorType, duration?: number) => void;
}> = ({ playSound }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('sanjay_shooter_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [shield, setShield] = useState(3);

  const isPlayingRef = useRef(false);
  isPlayingRef.current = isPlaying;
  const isGameOverRef = useRef(false);
  isGameOverRef.current = isGameOver;

  const handleStart = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setShield(3);
    playSound(440, 'triangle', 0.2);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localScore = 0;
    let localShield = 3;

    let playerX = canvas.width / 2;
    const playerY = canvas.height - 35;
    let leftPressed = false;
    let rightPressed = false;
    let fireCooldown = 0;

    interface Laser {
      x: number;
      y: number;
      speed: number;
    }

    interface Invader {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      hp: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      life: number;
      maxLife: number;
    }

    let lasers: Laser[] = [];
    let invaders: Invader[] = [];
    let particles: Particle[] = [];
    let spawnTimer = 0;

    const spawnExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 4 + 1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          color,
          life: 0,
          maxLife: 20 + Math.random() * 10,
        });
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!isPlayingRef.current || isGameOverRef.current) {
          handleStart();
        } else if (fireCooldown <= 0) {
          // Dual Repulsor Gauntlet Blasts
          lasers.push({ x: playerX - 15, y: playerY - 18, speed: 12 });
          lasers.push({ x: playerX + 15, y: playerY - 18, speed: 12 });
          fireCooldown = 10;
          playSound(880, 'square', 0.08);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') leftPressed = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') rightPressed = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      playerX = Math.max(25, Math.min(canvas.width - 25, (e.clientX - rect.left) * scaleX));
    };

    const handleMouseDown = () => {
      if (!isPlayingRef.current || isGameOverRef.current) {
        handleStart();
      } else if (fireCooldown <= 0) {
        // Dual Repulsor Gauntlet Blasts
        lasers.push({ x: playerX - 15, y: playerY - 18, speed: 12 });
        lasers.push({ x: playerX + 15, y: playerY - 18, speed: 12 });
        fireCooldown = 10;
        playSound(880, 'square', 0.08);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    const loop = () => {
      animId = requestAnimationFrame(loop);

      const w = canvas.width;
      const h = canvas.height;

      // Clear Screen
      ctx.fillStyle = '#070a12';
      ctx.fillRect(0, 0, w, h);

      // Starfield background
      ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
      for (let s = 0; s < 25; s++) {
        const sx = ((s * 137) % w);
        const sy = ((s * 93 + (animId * 0.5)) % h);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      if (!isPlayingRef.current && !isGameOverRef.current) {
        // Draw idle flying Mini Iron Man
        drawMiniIronmanShooter(ctx, w / 2, playerY, animId, false, localShield);
        return;
      }

      if (isGameOverRef.current) {
        renderShooterParticles(ctx, particles);
        return;
      }

      // Player Movement
      if (leftPressed) playerX = Math.max(25, playerX - 7);
      if (rightPressed) playerX = Math.min(w - 25, playerX + 7);
      if (fireCooldown > 0) fireCooldown--;

      // Spawn Invaders
      spawnTimer++;
      if (spawnTimer > Math.max(35 - Math.floor(localScore * 0.02), 18)) {
        spawnTimer = 0;
        const colors = ['#ec4899', '#a855f7', '#f59e0b', '#06b6d4'];
        invaders.push({
          x: Math.random() * (w - 40) + 20,
          y: -15,
          vx: (Math.random() - 0.5) * 2,
          vy: 1.8 + Math.min(localScore * 0.005, 3),
          size: 16 + Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          hp: 1,
        });
      }

      // Update Lasers (Repulsor Energy Beams)
      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i];
        l.y -= l.speed;
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.roundRect(l.x - 2.5, l.y, 5, 16, 2.5);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(l.x - 1, l.y + 2, 2, 12);
        ctx.shadowBlur = 0;

        if (l.y < -20) lasers.splice(i, 1);
      }

      // Update Invaders
      for (let i = invaders.length - 1; i >= 0; i--) {
        const inv = invaders[i];
        inv.x += inv.vx;
        inv.y += inv.vy;

        // Bounce on edges
        if (inv.x < inv.size || inv.x > w - inv.size) inv.vx *= -1;

        // Draw Invader Alien Bug
        ctx.fillStyle = inv.color;
        ctx.shadowColor = inv.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(inv.x, inv.y, inv.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(inv.x - 3, inv.y - 2, 6, 4);
        ctx.shadowBlur = 0;

        // Laser vs Invader collision
        for (let j = lasers.length - 1; j >= 0; j--) {
          const l = lasers[j];
          if (Math.hypot(l.x - inv.x, l.y - inv.y) < inv.size / 2 + 5) {
            lasers.splice(j, 1);
            spawnExplosion(inv.x, inv.y, inv.color);
            playSound(320, 'sawtooth', 0.12);
            localScore += 25;
            setScore(localScore);
            invaders.splice(i, 1);
            break;
          }
        }

        // Invader vs Player collision or passed bottom
        if (inv.y > h - 45 && Math.abs(inv.x - playerX) < 28) {
          spawnExplosion(inv.x, inv.y, '#ef4444');
          invaders.splice(i, 1);
          localShield -= 1;
          setShield(localShield);
          playSound(120, 'sawtooth', 0.25);

          if (localShield <= 0) {
            setIsGameOver(true);
            setHighScore((prev) => {
              const next = Math.max(prev, localScore);
              try {
                localStorage.setItem('sanjay_shooter_highscore', next.toString());
              } catch {
                // ignore
              }
              return next;
            });
          }
        } else if (inv.y > h + 20) {
          invaders.splice(i, 1);
        }
      }

      // Draw Mini Iron Man in Flight
      drawMiniIronmanShooter(ctx, playerX, playerY, animId, fireCooldown > 0, localShield);

      // Render Particles
      renderShooterParticles(ctx, particles);
    };

    const drawMiniIronmanShooter = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      frame: number,
      isFiring: boolean,
      shieldLevel: number
    ) => {
      ctx.save();

      // 0. Holographic Jarvis Energy Shield
      if (shieldLevel > 0) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#00f0ff';
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(x, y - 5, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 1. Dual Jet Boot Repulsor Thrust Flames (Shooting downwards behind him)
      const flameLen = 14 + Math.sin(frame * 0.7) * 5;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00f0ff';

      const flameGrad = ctx.createLinearGradient(x, y + 14, x, y + 14 + flameLen);
      flameGrad.addColorStop(0, '#ffffff');
      flameGrad.addColorStop(0.3, '#00f0ff');
      flameGrad.addColorStop(0.7, '#f59e0b');
      flameGrad.addColorStop(1, 'transparent');

      // Left boot flame
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 12);
      ctx.lineTo(x - 5, y + 14 + flameLen);
      ctx.lineTo(x - 2, y + 12);
      ctx.closePath();
      ctx.fill();

      // Right boot flame
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 12);
      ctx.lineTo(x + 5, y + 14 + flameLen);
      ctx.lineTo(x + 8, y + 12);
      ctx.closePath();
      ctx.fill();

      // 2. Armored Legs (Red & Gold)
      ctx.fillStyle = '#991b1b';
      ctx.fillRect(x - 9, y + 4, 6, 10);
      ctx.fillRect(x + 3, y + 4, 6, 10);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - 9, y + 7, 6, 3);
      ctx.fillRect(x + 3, y + 7, 6, 3);

      // 3. Torso & Nano-Armor Chest (Looking Upwards Flight Pose)
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x - 12, y - 10, 24, 16, 5);
      ctx.fill();
      ctx.stroke();

      // Gold Collar & Rib Plates
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(x - 8, y - 8, 16, 3);
      ctx.fillRect(x - 6, y + 1, 12, 3);

      // 4. Glowing Unibeam Arc Reactor (Center Chest Aura)
      ctx.shadowBlur = isFiring ? 25 : 15;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(x, y - 3, isFiring ? 6 : 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Dual Repulsor Gauntlet Arms (Extended Forward / Upward to Shoot)
      ctx.fillStyle = '#dc2626';
      // Left arm
      ctx.fillRect(x - 19, y - 14, 7, 14);
      // Right arm
      ctx.fillRect(x + 12, y - 14, 7, 14);

      // Gold Gauntlet Armor
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(x - 19, y - 12, 7, 4);
      ctx.fillRect(x + 12, y - 12, 7, 4);

      // Palm Repulsor Blaster Glows
      ctx.shadowBlur = isFiring ? 22 : 10;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = isFiring ? '#ffffff' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(x - 15.5, y - 15, isFiring ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.arc(x + 15.5, y - 15, isFiring ? 4.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 6. Mini Iron Man Helmet (Flight Angle)
      ctx.fillStyle = '#b91c1c';
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x - 9, y - 24, 18, 15, 4);
      ctx.fill();
      ctx.stroke();

      // Gold Faceplate
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 22);
      ctx.lineTo(x + 6, y - 22);
      ctx.lineTo(x + 7, y - 14);
      ctx.lineTo(x + 4, y - 11);
      ctx.lineTo(x - 4, y - 11);
      ctx.lineTo(x - 7, y - 14);
      ctx.closePath();
      ctx.fill();

      // Glowing Cyan Slit Eyes
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f0ff';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 5, y - 18, 3.5, 2);
      ctx.fillRect(x + 1.5, y - 18, 3.5, 2);

      ctx.restore();
    };

    const renderShooterParticles = (ctx: CanvasRenderingContext2D, list: any[]) => {
      ctx.save();
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          list.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 1 - p.life / p.maxLife;
        ctx.fillRect(p.x, p.y, 3, 3);
      }
      ctx.restore();
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [playSound]);

  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-4 sm:p-8 max-w-4xl mx-auto shadow-2xl space-y-4">
      {/* HUD */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Crosshair className="w-4 h-4 text-pink-400" />
            <span className="text-slate-400">SCORE:</span>
            <span className="font-heading font-bold text-lg text-pink-300">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">HIGH:</span>
            <span className="font-heading font-bold text-lg text-amber-300">{highScore.toString().padStart(5, '0')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">SHIELD:</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full ${
                  s <= shield ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        onClick={() => {
          if (!isPlaying || isGameOver) handleStart();
        }}
        className="relative w-full h-[340px] rounded-2xl overflow-hidden bg-[#070a12] border border-slate-800 cursor-crosshair select-none"
      >
        <canvas ref={canvasRef} width={800} height={340} className="w-full h-full object-cover" />

        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 bg-[#070a12]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/30 animate-pulse">
              <Crosshair className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1">
                NEURAL SPACE DEFENDER
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md font-light">
                Use <strong className="text-cyan-400 font-mono">MOUSE / ARROW KEYS</strong> to Move • <strong className="text-pink-400 font-mono">SPACE / CLICK</strong> to Fire!
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-heading font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 transition-all flex items-center space-x-2"
            >
              <Play className="w-4 h-4 text-white" />
              <span>ENGAGE DEFENSE</span>
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-[#070a12]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/40">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-heading font-extrabold text-white">DEFENSE BREACHED</h3>
            <div className="flex items-center space-x-6 text-xs font-mono bg-slate-900/80 px-6 py-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">FINAL SCORE</span>
                <span className="font-bold text-lg text-pink-300">{score}</span>
              </div>
              <div className="h-6 w-[1px] bg-slate-800" />
              <div>
                <span className="text-slate-500 block text-[10px]">RECORD</span>
                <span className="font-bold text-lg text-amber-300">{highScore}</span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStart();
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART DEFENDER</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 pt-2">
        <div className="flex items-center space-x-3">
          <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-slate-200">A / D or Mouse</span>
          <span>Steer</span>
          <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800 text-pink-300">Space / Click</span>
          <span>Plasma Cannon</span>
        </div>
        <span className="text-slate-500">Destroy glitch nodes (+25 each)</span>
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 3: CYBER MEMORY MATRIX (HACKER PUZZLE)
   ========================================================================= */
const MemoryGame: React.FC<{
  soundEnabled: boolean;
  playSound: (freq: number, type?: OscillatorType, duration?: number) => void;
}> = ({ playSound }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('sanjay_memory_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [status, setStatus] = useState<'idle' | 'showing' | 'player' | 'fail'>('idle');

  const padFrequencies = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];

  const pads = [
    { id: 0, label: 'NODE-01', color: 'from-cyan-500 to-blue-600', ring: 'ring-cyan-400', shadow: '#06b6d4' },
    { id: 1, label: 'NODE-02', color: 'from-purple-600 to-indigo-600', ring: 'ring-purple-400', shadow: '#a855f7' },
    { id: 2, label: 'NODE-03', color: 'from-pink-500 to-rose-600', ring: 'ring-pink-400', shadow: '#ec4899' },
    { id: 3, label: 'NODE-04', color: 'from-amber-400 to-orange-500', ring: 'ring-amber-400', shadow: '#f59e0b' },
    { id: 4, label: 'NODE-05', color: 'from-emerald-400 to-teal-600', ring: 'ring-emerald-400', shadow: '#10b981' },
    { id: 5, label: 'NODE-06', color: 'from-violet-500 to-fuchsia-600', ring: 'ring-fuchsia-400', shadow: '#d946ef' },
  ];

  const startNewGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setRound(1);
    const firstSeq = [Math.floor(Math.random() * 6)];
    setSequence(firstSeq);
    setStatus('showing');
    playSequence(firstSeq);
  };

  const playSequence = (seq: number[]) => {
    setStatus('showing');
    seq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        playSound(padFrequencies[padId], 'sine', 0.25);
        setTimeout(() => {
          setActivePad(null);
          if (index === seq.length - 1) {
            setStatus('player');
            setPlayerInput([]);
          }
        }, 350);
      }, (index + 1) * 600);
    });
  };

  const handlePadClick = (id: number) => {
    if (status !== 'player') return;

    setActivePad(id);
    playSound(padFrequencies[id], 'sine', 0.2);
    setTimeout(() => setActivePad(null), 250);

    const nextInput = [...playerInput, id];
    setPlayerInput(nextInput);

    const currentIndex = nextInput.length - 1;
    if (nextInput[currentIndex] !== sequence[currentIndex]) {
      // Failed!
      setStatus('fail');
      playSound(120, 'sawtooth', 0.4);
      setHighScore((prev) => {
        const next = Math.max(prev, round - 1);
        try {
          localStorage.setItem('sanjay_memory_highscore', next.toString());
        } catch {
          // ignore
        }
        return next;
      });
      return;
    }

    // Completed round!
    if (nextInput.length === sequence.length) {
      playSound(880, 'sine', 0.25);
      const nextRound = round + 1;
      setRound(nextRound);
      const nextSeq = [...sequence, Math.floor(Math.random() * 6)];
      setSequence(nextSeq);
      setTimeout(() => {
        playSequence(nextSeq);
      }, 800);
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-slate-800 p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl space-y-6">
      {/* HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">ROUND LEVEL:</span>
            <span className="font-heading font-bold text-lg text-emerald-300">{round}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">MAX RECORD:</span>
            <span className="font-heading font-bold text-lg text-amber-300">{highScore}</span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          {status === 'idle' && 'SYSTEM STANDBY'}
          {status === 'showing' && 'OBSERVE NEURAL PULSE...'}
          {status === 'player' && 'REPLICATE SEQUENCE!'}
          {status === 'fail' && 'CONNECTION SEVERED!'}
        </div>
      </div>

      {/* Cyber Pads Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto py-4">
        {pads.map((pad) => {
          const isActive = activePad === pad.id;
          return (
            <button
              key={pad.id}
              disabled={status !== 'player'}
              onClick={() => handlePadClick(pad.id)}
              className={`h-28 rounded-2xl border transition-all duration-150 relative overflow-hidden flex flex-col items-center justify-center p-3 group ${
                isActive
                  ? `bg-gradient-to-br ${pad.color} text-white scale-105 ring-4 ${pad.ring} shadow-[0_0_30px_${pad.shadow}]`
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-400'
              } ${status !== 'player' ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'}`}
            >
              <span className="text-xs font-mono font-bold tracking-widest">{pad.label}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-1">NODE #{pad.id + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex justify-center pt-2">
        {status === 'idle' && (
          <button
            onClick={startNewGame}
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-cyan-600 to-purple-600 text-white font-heading font-bold text-sm rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-all flex items-center space-x-2"
          >
            <Play className="w-4 h-4 text-white" />
            <span>START MEMORY HACK</span>
          </button>
        )}

        {status === 'fail' && (
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-pink-400 uppercase tracking-widest block">
              PATTERN MISMATCH • ROUNDS REACHED: {round - 1}
            </span>
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-heading font-semibold text-xs rounded-xl shadow-lg hover:scale-105 transition-all flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>TRY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center text-xs font-mono text-slate-500 pt-2">
        Memorize the glowing sequence of neural node pulses and tap them in order.
      </div>
    </div>
  );
};
